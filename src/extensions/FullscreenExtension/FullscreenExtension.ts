import { Module } from '@src/Module';
import { Events, IEventData, IInstance } from '@src/types';
import * as screenfull from 'screenfull';

interface IFullscreenEventData extends IEventData {
  fullscreen: boolean;
}

export class FullscreenExtension extends Module {
  public name: string = 'FullscreenExtension';

  constructor(instance: IInstance) {
    super(instance);

    if (screenfull.enabled) {
      this.emit(Events.FULLSCREEN_SUPPORTED);

      screenfull.on('change', () => {
        this.emit(Events.FULLSCREEN_CHANGE, {
          fullscreen: screenfull.isFullscreen,
        } as IFullscreenEventData);
      });
    }
  }

  public toggleFullscreen() {
    if (screenfull.enabled) {
      screenfull.toggle(this.instance.container);
    }
  }
}
