import { Module } from '@src/Module';
import { Events, IEventData, IInstance } from '@src/types';

import * as sfDefault from 'screenfull';
const screenfull = sfDefault as sfDefault.Screenfull;

interface IFullscreenEventData extends IEventData {
  fullscreen: boolean;
}

export class FullscreenExtension extends Module {
  public name: string = 'FullscreenExtension';

  private documentPos: {
    x: number;
    y: number;
  };

  constructor(instance: IInstance) {
    super(instance);

    if (screenfull.enabled) {
      this.emit(Events.FULLSCREEN_SUPPORTED);

      screenfull.on('change', () => {
        const fullscreen: boolean = screenfull.isFullscreen;

        this.handleDocumentPos(fullscreen);

        this.emit(Events.FULLSCREEN_CHANGE, {
          fullscreen,
        } as IFullscreenEventData);
      });
    }
  }

  public toggleFullscreen() {
    if (screenfull.enabled) {
      screenfull.toggle(this.instance.container);
    }
  }

  // Code below evades the following Chromium bug:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=142427.
  private handleDocumentPos(isFullscreen: boolean) {
    if (isFullscreen) {
      const x = window.pageXOffset;
      const y = window.pageYOffset;
      if (x || y) {
        this.documentPos = {
          x: x || 0,
          y: y || 0,
        };
      }
    } else {
      if (!this.documentPos) {
        return;
      }

      window.scrollTo(this.documentPos.x, this.documentPos.y);
      this.documentPos = null;
    }
  }
}
