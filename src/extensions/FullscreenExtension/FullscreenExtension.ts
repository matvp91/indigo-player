import { Module } from '@src/Module';
import { Events, IEventData, IInstance } from '@src/types';
import * as screenfull from 'screenfull';

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
    
    if (screenfull && screenfull.enabled) {
      this.emit(Events.FULLSCREEN_SUPPORTED);

      screenfull.on('change', () => {
        const fullscreen: boolean = (screenfull && screenfull.isFullscreen);

        this.handleDocumentPos(fullscreen);

        this.emit(Events.FULLSCREEN_CHANGE, {
          fullscreen,
        } as IFullscreenEventData);
      });
    }
    else if(instance.env.isIOS) {
      this.on(Events.READY, this.onReady.bind(this));
    }
    
    
  }
  
  public onReady() {
    if(this.instance.player.mediaElement.webkitEnterFullscreen) {
      this.emit(Events.FULLSCREEN_SUPPORTED);
    }
  }

  public toggleFullscreen() {
    if (screenfull && screenfull.enabled) {
      screenfull.toggle(this.instance.container);
    }
    else if(this.instance.env.isIOS && this.instance.player.mediaElement.webkitEnterFullscreen) {
      this.instance.player.mediaElement.webkitEnterFullscreen()
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
