import { Module } from '@src/Module';
import { IMedia, ITrack } from '@src/types';

export class Media extends Module implements IMedia {
  public async load() {}

  public unload() {}

  public play() {
    this.instance.player.play();
  }

  public pause() {
    this.instance.player.pause();
  }

  public seekTo(time: number) {
    this.instance.player.seekTo(time);
  }

  public setVolume(volume: number) {
    this.instance.player.setVolume(volume);
  }

  public selectTrack(track: ITrack) {}

  public selectAudioLanguage(language: string) {}

  public setPlaybackRate(playbackRate: number) {
    this.instance.player.setPlaybackRate(playbackRate);
  }
}
