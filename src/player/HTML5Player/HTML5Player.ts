import { Player } from '@src/player/Player';
import {
  Events,
  IBufferedChangeEventData,
  IDurationChangeEventData,
  IPlaybackRateChangeEventData,
  ITimeUpdateEventData,
  IVolumeChangeEventData,
} from '@src/types';
import requestFrame from 'request-frame';

export class HTML5Player extends Player {
  public name: string = 'HTML5Player';

  public mediaElement: HTMLVideoElement;

  public load() {
    super.load();

    this.mediaElement = document.createElement('video');
    this.mediaElement.style.width = '100%';
    this.mediaElement.style.height = '100%';
    this.mediaElement.preload = 'metadata';
    this.mediaElement.crossOrigin = 'anonymous';
    this.mediaElement.volume = 1;
    this.mediaElement.setAttribute('playsinline', '');
    this.mediaElement.setAttribute('preload', 'auto');
    this.instance.playerContainer.appendChild(this.mediaElement);

    this.mediaElement.addEventListener('playing', () => {
      this.emit(Events.PLAYER_STATE_PLAYING);
    });

    this.mediaElement.addEventListener('ended', () => {
      this.emit(Events.PLAYER_STATE_ENDED);
    });

    this.mediaElement.addEventListener('seeked', () => {
      this.emit(Events.PLAYER_STATE_SEEKED);
    });

    this.mediaElement.addEventListener('durationchange', () => {
      this.emit(Events.PLAYER_STATE_DURATIONCHANGE, {
        duration: this.mediaElement.duration,
      } as IDurationChangeEventData);
    });

    this.mediaElement.addEventListener('waiting', () => {
      this.emit(Events.PLAYER_STATE_WAITING);
    });

    this.mediaElement.addEventListener('volumechange', () => {
      let volume = this.mediaElement.volume;
      if (this.mediaElement.muted) {
        volume = 0;
      }
      this.emit(Events.PLAYER_STATE_VOLUMECHANGE, {
        volume,
      } as IVolumeChangeEventData);
    });

    this.mediaElement.addEventListener('loadeddata', () =>
      this.monitorProgress(),
    );
    this.mediaElement.addEventListener('progress', () =>
      this.monitorProgress(),
    );

    this.mediaElement.addEventListener('ratechange', () => {
      this.emit(Events.PLAYER_STATE_RATECHANGE, {
        playbackRate: this.mediaElement.playbackRate,
      } as IPlaybackRateChangeEventData);
    });

    this.mediaElement.addEventListener('timeupdate', () => {
      this.emit(Events.PLAYER_STATE_TIMEUPDATE, {
        currentTime: this.mediaElement.currentTime,
      } as ITimeUpdateEventData);
    });
  }

  public unload() {
    if (this.mediaElement) {
      this.mediaElement.pause();
      this.mediaElement.removeAttribute('src');
      this.mediaElement.load();
      this.mediaElement.remove();
    }
    super.unload();
  }

  public setSource(src: string) {
    this.mediaElement.src = src;
  }

  public play() {
    this.emit(Events.PLAYER_STATE_PLAY);
    this.mediaElement.play();
  }

  public pause() {
    this.emit(Events.PLAYER_STATE_PAUSE);
    this.mediaElement.pause();
  }

  public seekTo(time: number) {
    this.emit(Events.PLAYER_STATE_TIMEUPDATE, {
      currentTime: time,
    } as ITimeUpdateEventData);

    this.mediaElement.currentTime = time;
  }

  public setVolume(volume: number) {
    this.mediaElement.volume = volume;
    this.mediaElement.muted = volume === 0;
  }

  public setPlaybackRate(playbackRate: number) {
    this.mediaElement.playbackRate = playbackRate;
  }

  private monitorProgress() {
    const buffered: any = this.mediaElement.buffered;
    const time: number = this.mediaElement.currentTime;
    let percentage: number;

    for (let range = 0; range < buffered.length; range += 1) {
      if (buffered.start(range) <= time && buffered.end(range) > time) {
        percentage = buffered.end(range) / this.mediaElement.duration;
        break;
      }
    }

    if (percentage !== undefined) {
      this.emit(Events.PLAYER_STATE_BUFFEREDCHANGE, {
        percentage,
      } as IBufferedChangeEventData);
    }
  }
}
