import { Player } from '@src/player/Player';
import {
  Events,
  ReadyEventData,
  TimeUpdateEventData,
  VolumeChangeEventData,
} from '@src/types';

export class HTML5Player extends Player {
  public name: string = 'HTML5Player';

  public mediaElement: HTMLMediaElement;

  public load() {
    super.load();

    this.mediaElement = document.createElement('video');
    this.mediaElement.style.width = '100%';
    this.mediaElement.style.height = '100%';
    this.instance.playerContainer.appendChild(this.mediaElement);

    if (this.instance.config.showNativeControls) {
      this.mediaElement.controls = true;
    }

    this.mediaElement.addEventListener('playing', () => {
      this.emit(Events.PLAYER_STATE_PLAYING);
    });

    this.mediaElement.addEventListener('ended', () => {
      this.emit(Events.PLAYER_STATE_ENDED);
    });

    this.mediaElement.addEventListener('seeked', () => {
      this.emit(Events.PLAYER_STATE_SEEKED);
    });

    this.mediaElement.addEventListener('timeupdate', () => {
      this.emit(Events.PLAYER_STATE_TIMEUPDATE, {
        currentTime: this.mediaElement.currentTime,
      } as TimeUpdateEventData);
    });

    this.mediaElement.addEventListener('loadedmetadata', () => {
      this.emit(Events.PLAYER_STATE_READY, {
        duration: this.mediaElement.duration,
      } as ReadyEventData);
    });

    this.mediaElement.addEventListener('waiting', () => {
      this.emit(Events.PLAYER_STATE_WAITING);
    });

    this.mediaElement.addEventListener('volumechange', () => {
      this.emit(Events.PLAYER_STATE_VOLUMECHANGE, {
        volume: this.mediaElement.volume,
      } as VolumeChangeEventData);
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
    this.mediaElement.currentTime = time;
  }

  public setVolume(volume: number) {
    this.mediaElement.volume = volume;
  }
}
