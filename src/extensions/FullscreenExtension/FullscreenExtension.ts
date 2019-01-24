import { Module } from '@src/Module';
import { IInstance, Events, FullscreenEventData } from '@src/types';
import * as screenfull from 'screenfull';

export class FullscreenExtension extends Module {
  public name: string = 'FullscreenExtension';

  constructor(instance: IInstance) {
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
