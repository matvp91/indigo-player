import { Media } from '@src/media/Media';
import { HTML5Player } from '@src/player/HTML5Player/HTML5Player';
import { PlayerError } from '@src/PlayerError';
import {
  ErrorCodes,
  Events,
  Format,
  IAudioLanguageEventData,
  IAudioLanguagesEventData,
  IEventData,
  IInstance,
  ITrack,
  ITrackChangeEventData,
  ITracksEventData,
} from '@src/types';
import * as shaka from 'shaka-player';

interface IShakaInstEventData extends IEventData {
  shaka: any;
  player: any;
}

export class DashMedia extends Media {
  public name: string = 'DashMedia';

  public player: any;

  private track: ITrack;

  constructor(instance: IInstance) {
    super(instance);

    shaka.polyfill.installAll();
  }

  public formatTrack = (track: any): ITrack => ({
    id: track.id,
    width: track.width,
    height: track.height,
    bitrate: track.bandwidth,
  });

  public async load() {
    await super.load();

    const mediaElement: HTMLMediaElement = (this.instance.getModule(
      'HTML5Player',
    ) as any).mediaElement;

    this.player = new shaka.Player(mediaElement);

    this.player.addEventListener('error', this.onErrorEvent.bind(this));
    this.player.addEventListener(
      'adaptation',
      this.onAdaptationEvent.bind(this),
    );
    this.player.addEventListener(
      'trackschanged',
      this.onTracksChanged.bind(this),
    );
    this.player.addEventListener(
      'variantchanged',
      this.onVariantChanged.bind(this),
    );

    this.emit(Events.SHAKA_INSTANCE, {
      shaka,
      player: this.player,
    } as IShakaInstEventData);

    const configuration: any = {
      abr: {
        enabled: true,
        defaultBandwidthEstimate:
          Number(this.instance.storage.get('estimatedBandwidth', 0)) ||
          1024 * 1000,
      },
    };

    if (this.instance.format.drm) {
      configuration.drm = {
        servers: {
          'com.widevine.alpha': this.instance.format.drm.widevine.licenseUrl,
          'com.microsoft.playready': this.instance.format.drm.playready
            .licenseUrl,
        },
        advanced: {
          'com.widevine.alpha': {
            audioRobustness: 'SW_SECURE_CRYPTO',
            videoRobustness: 'SW_SECURE_DECODE',
          },
        },
      };
    }

    this.instance.log('dash.load')('Starting Shaka', { configuration });

    this.player.configure(configuration);

    try {
      await this.player.load(this.instance.format.src);

      this.updateAudioLanguages();
    } catch (error) {
      this.onError(error);
    }
  }

  public unload() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
  }

  public selectTrack(track: ITrack | string) {
    if (track === 'auto') {
      this.player.configure({ abr: { enabled: true } });
      this.emitTrackChange();
    } else {
      this.player.configure({ abr: { enabled: false } });

      this.track = track as ITrack;
      this.emitTrackChange();

      const variantTrack = this.player
        .getVariantTracks()
        .find(variantTrack => variantTrack.id === (track as ITrack).id);

      if (variantTrack) {
        this.player.selectVariantTrack(variantTrack, true);
      }
    }
  }

  public selectAudioLanguage(language: string) {
    this.player.selectAudioLanguage(language);

    this.emit(Events.MEDIA_STATE_AUDIOLANGUAGECHANGE, {
      audioLanguage: language,
    } as IAudioLanguageEventData);

    this.updateTracks();
  }

  private emitTrackChange() {
    this.emit(Events.MEDIA_STATE_TRACKCHANGE, {
      track: this.track,
      auto: this.player.getConfiguration().abr.enabled,
    } as ITrackChangeEventData);
  }

  private onErrorEvent(event) {
    this.onError(event.detail);
  }

  private onError(error) {
    if (error.severity === 2) {
      this.instance.setError(
        new PlayerError(ErrorCodes.SHAKA_CRITICAL_ERROR, error),
      );
    }
  }

  private onAdaptationEvent() {
    const track = this.formatTrack(
      this.player.getVariantTracks().find(track => track.active),
    );

    this.track = track;
    this.emitTrackChange();

    const estimatedBandwidth = this.player.getStats().estimatedBandwidth;
    this.instance.storage.set('estimatedBandwidth', estimatedBandwidth);
  }

  private onTracksChanged() {
    this.updateAudioLanguage();
    this.updateTracks();
  }

  private onVariantChanged() {
    this.updateAudioLanguage();
    this.updateTracks();
  }

  private updateAudioLanguages() {
    const audioLanguages = this.player.getAudioLanguages();

    this.emit(Events.MEDIA_STATE_AUDIOLANGUAGES, {
      audioLanguages,
    } as IAudioLanguagesEventData);
  }

  private updateAudioLanguage() {
    const variant = this.player
      .getVariantTracks()
      .find(variant => variant.active);

    if (!variant) {
      return;
    }

    this.emit(Events.MEDIA_STATE_AUDIOLANGUAGECHANGE, {
      audioLanguage: variant.language,
    } as IAudioLanguageEventData);
  }

  private updateTracks() {
    const activeLanguage = this.player
      .getVariantTracks()
      .find(track => track.active).language;

    const tracks = this.player
      .getVariantTracks()
      .filter(
        track => track.type === 'variant' && track.language === activeLanguage,
      )
      .sort((a, b) => b.bandwidth - a.bandwidth)
      .map(this.formatTrack);

    this.emit(Events.MEDIA_STATE_TRACKS, {
      tracks,
    } as ITracksEventData);
  }
}
