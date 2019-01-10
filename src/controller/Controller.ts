import { Module } from '@src/Module';
import { IController } from '@src/types';

export class Controller extends Module implements IController {
  public async boot() {}

  public load() {
    this.instance.player.load();
    this.instance.media.load();
  }

  public unload() {
    if (this.instance.media) {
      this.instance.media.unload();
    }
    if (this.instance.player) {
      this.instance.player.unload();
    }
  }

  public play() {
    this.instance.media.play();
  }

  public pause() {
    this.instance.media.pause();
  }

  public seekTo(time: number) {
    this.instance.media.seekTo(time);
  }

  public setVolume(volume: number) {
    this.instance.media.setVolume(volume);
  }
}
