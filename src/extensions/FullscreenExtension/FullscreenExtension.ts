import { Instance } from '@src/Instance';
import { Module } from '@src/Module';
import { Events, FullscreenEventData } from '@src/types';
import * as screenfull from 'screenfull';

export class FullscreenExtension extends Module {
  constructor(instance: Instance) {
    super(instance);

    if (screenfull.enabled) {
      this.emit(Events.FULLSCREEN_SUPPORTED);

      screenfull.on('change', () => {
        this.emit(Events.FULLSCREEN_CHANGE, {
          fullscreen: screenfull.isFullscreen,
        } as FullscreenEventData);
      });
    }
  }

  public toggleFullscreen() {
    if (screenfull.enabled) {
      screenfull.toggle(this.instance.container);
    }
  }
}
