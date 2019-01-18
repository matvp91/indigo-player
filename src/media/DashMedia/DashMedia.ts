import { Instance } from '@src/Instance';
import { Media } from '@src/media/Media';
import { HTML5Player } from '@src/player/HTML5Player/HTML5Player';
import { PlayerError } from '@src/PlayerError';
import { ErrorCodes, Events, Format, ShakaInstanceEventData } from '@src/types';
import * as shaka from 'shaka-player';

export class DashMedia extends Media {
  public name: string = 'DashMedia';

  public player: any;

  constructor(instance: Instance) {
    super(instance);

    shaka.polyfill.installAll();
  }

  public async load() {
    await super.load();

    await this.loadShaka();
  }

  public unload() {
    this.player.destroy();
    this.player = null;
  }

  private async loadShaka({
    defaultBandwidthEstimate,
    abr = true,
  }: { defaultBandwidthEstimate?: number; abr?: boolean } = {}) {
    const mediaElement: HTMLMediaElement = (this.instance.player as HTML5Player)
      .mediaElement;

    this.player = new shaka.Player(mediaElement);

    this.player.addEventListener('error', this.onErrorEvent.bind(this));

    this.emit(Events.SHAKA_INSTANCE, {
      shaka,
      player: this.player,
    } as ShakaInstanceEventData);

    const configuration: { drm?: any } = {};

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

    this.player.configure(configuration);

    try {
      await this.player.load(this.instance.format.src);
    } catch (error) {
      this.onError(error);
    }
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
}
