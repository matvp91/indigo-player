import { Media } from '@src/media/Media';
import { HTML5Player } from '@src/player/HTML5Player/HTML5Player';
import { PlayerError } from '@src/PlayerError';
import {
  ErrorCodes,
  Events,
  Format,
  ITrack,
  ITrackChangeEventData,
  ITracksEventData,
} from '@src/types';
import HlsJs from 'hls.js';

export class HlsMedia extends Media {
  public name: string = 'HlsMedia';

  public player: any;

  public async load() {
    await super.load();

    this.player = new HlsJs({
      autoStartLoad: false,
    });

    const mediaElement: HTMLMediaElement = (this.instance.getModule(
      'HTML5Player',
    ) as any).mediaElement;

    this.player.attachMedia(mediaElement);

    this.player.on(HlsJs.Events.MANIFEST_PARSED, (event, data) => {
      const tracks = data.levels
        .map(this.formatTrack)
        .sort((a, b) => b.bandwidth - a.bandwidth);

      this.emit(Events.MEDIA_STATE_TRACKS, {
        tracks,
      } as ITracksEventData);
    });

    this.player.on(HlsJs.Events.LEVEL_SWITCHED, (event, data) => {
      const level = data.level;

      this.emit(Events.MEDIA_STATE_TRACKCHANGE, {
        track: this.formatTrack(this.player.levels[data.level], data.level),
        auto: this.player.autoLevelEnabled,
      } as ITrackChangeEventData);
    });

    this.player.on(HlsJs.Events.ERROR, (event, data) => {
      if (!data.fatal) {
        return;
      }

      if (data.type === HlsJs.ErrorTypes.NETWORK_ERROR) {
        this.player.startLoad();
      } else if (data.type === HlsJs.ErrorTypes.MEDIA_ERROR) {
        this.player.recoverMediaError();
      } else {
        this.instance.setError(
          new PlayerError(ErrorCodes.HLSJS_CRITICAL_ERROR, data),
        );
      }
    });

    this.player.loadSource(this.instance.format.src);

    this.player.startLoad();
  }

  public seekTo(time: number) {
    if (time === Infinity) {
      this.instance.player.seekTo(this.player.liveSyncPosition);
      return;
    }
    super.seekTo(time);
  }

  public unload() {
    this.player.destroy();
    this.player = null;
  }

  public selectTrack(track: ITrack | string) {
    if (track === 'auto') {
      this.player.currentLevel = -1;
    } else {
      this.player.currentLevel = (track as ITrack).id;
    }
  }

  private formatTrack = (track: any, id: number): ITrack => ({
    id,
    width: track.width,
    height: track.height,
    bandwidth: track.bitrate,
  });
}
