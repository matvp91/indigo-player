import { Controller } from '@src/controller/Controller';
import { ITrack, Events, IVolumeChangeEventData, ITimeUpdateEventData, IDurationChangeEventData, IPlaybackRateChangeEventData } from '@src/types';
import Player from '@vimeo/player';
import { createElement } from '@src/utils/dom';

// Note: Vimeo playback is currently unsupported, this is merely a test feature.
//       I wouldn't rely on this implementation as it is unproven.

export class VimeoController extends Controller {
  public name: string = 'VimeoController';

  private player: any;

  private prevDuration: number = 0;

  public async load() {
    const topPercentage = 200;
    const topPlacement = (topPercentage - (9 / 16 * 100)) / (topPercentage * 0.02);

    const container: HTMLDivElement = createElement<HTMLDivElement>('div', {
      paddingBottom: `${topPercentage}%`,
      position: 'relative',
    });
    this.instance.playerContainer.appendChild(container);

    const iframe: HTMLIFrameElement = createElement<HTMLIFrameElement>('iframe', {
      border: '0',
      bottom: `${topPlacement}%`,
      left: '0',
      width: '100%',
      height: '100%',
      position: 'absolute',
    }, {
      allow: 'autoplay',
      allowfullscreen: '',
      allowtransparency: '',
    });
    container.appendChild(iframe);

    const params = {
      speed: true,
      transparent: 0,
      gesture: 'media',
      byline: false,
      portrait: false,
      title: false,
      playsinline: true,
    };

    const query = Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
    iframe.src = `https://player.vimeo.com/video/${this.instance.config.vimeo.id}?${query}`;

    this.player = new Player(iframe);

    this.player.on('play', () => {
      this.emit(Events.PLAYER_STATE_PLAYING);
    });

    this.player.on('volumechange', ({ volume }) => {
      this.emit(Events.PLAYER_STATE_VOLUMECHANGE, {
        volume,
      } as IVolumeChangeEventData);
    });

    this.player.on('bufferstart', () => {
      this.emit(Events.PLAYER_STATE_WAITING);
    });

    this.player.on('timeupdate', ({ duration, seconds }) => {
      if (this.prevDuration !== duration) {
        this.prevDuration = duration;
        this.emit(Events.PLAYER_STATE_DURATIONCHANGE, {
          duration,
        } as IDurationChangeEventData);
      }

      this.emit(Events.PLAYER_STATE_TIMEUPDATE, {
        currentTime: seconds,
      } as ITimeUpdateEventData);
    });

    this.player.on('playbackratechange', ({ playbackRate }) => {
      this.emit(Events.PLAYER_STATE_RATECHANGE, {
        playbackRate,
      } as IPlaybackRateChangeEventData);
    });
  }

  public unload() {
    this.player.destroy();
  }

  public play() {
    this.emit(Events.PLAYER_STATE_PLAY);
    this.player.play();
  }

  public pause() {
    this.emit(Events.PLAYER_STATE_PAUSE);
    this.player.pause();
  }

  public seekTo(time: number) {
    this.player.setCurrentTime(time);
  }

  public setVolume(volume: number) {
    this.player.setVolume(volume);
  }

  public setPlaybackRate(playbackRate: number) {
    this.player.setPlaybackRate(playbackRate);
  }
}
