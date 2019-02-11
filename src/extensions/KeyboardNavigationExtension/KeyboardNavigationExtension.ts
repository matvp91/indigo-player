import { Module } from '@src/Module';
import { Events, IInstance, IKeyboardNavigationKeyDownEventData, KeyboardNavigationPurpose } from '@src/types';
import { StateExtension } from '@src/extensions/StateExtension/StateExtension';
import { FullscreenExtension } from '@src/extensions/FullscreenExtension/FullscreenExtension';

enum KeyCodes {
  SPACEBAR = 32,
  K = 75,
  LEFT_ARROW = 37,
  RIGHT_ARROW = 39,
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  M = 77,
  F = 70,
}

const SKIP_CURRENTTIME_OFFSET: number = 5;

const SKIP_VOLUME_OFFSET: number = 0.1;

export class KeyboardNavigationExtension extends Module {
  public name: string = 'KeyboardNavigationExtension';

  constructor(instance: IInstance) {
    super(instance);

    (window as any).addEventListener('keydown', this.onKeyDown);
  }

  private getState() {
    return (this.instance.getModule('StateExtension') as StateExtension).getState();
  }

  private emitPurpose(purpose: KeyboardNavigationPurpose) {
    this.instance.emit(Events.KEYBOARDNAVIGATION_KEYDOWN, {
      purpose,
    } as IKeyboardNavigationKeyDownEventData);
  }

  private onKeyDown = event => {
    switch (event.which || event.keyCode) {
      case KeyCodes.SPACEBAR:
      case KeyCodes.K:
        if (this.getState().playRequested) {
          this.instance.pause();
          this.emitPurpose(KeyboardNavigationPurpose.PAUSE);
        } else {
          this.instance.play();
          this.emitPurpose(KeyboardNavigationPurpose.PLAY);
        }
        event.preventDefault();
        break;

      case KeyCodes.LEFT_ARROW:
        let prevTime = this.getState().currentTime - SKIP_CURRENTTIME_OFFSET;
        if (prevTime < 0) {
          prevTime = 0;
        }
        this.instance.seekTo(prevTime);
        this.emitPurpose(KeyboardNavigationPurpose.PREV_SEEK);
        event.preventDefault();
        break;

      case KeyCodes.RIGHT_ARROW:
        let nextTime = this.getState().currentTime + SKIP_CURRENTTIME_OFFSET;
        if (nextTime > this.getState().duration) {
          nextTime = this.getState().duration;
        }
        this.instance.seekTo(nextTime);
        this.emitPurpose(KeyboardNavigationPurpose.NEXT_SEEK);
        event.preventDefault();
        break;

      case KeyCodes.UP_ARROW:
        let nextVolume = this.getState().volume + SKIP_VOLUME_OFFSET;
        if (nextVolume > 1) {
          nextVolume = 1;
        }
        this.instance.setVolume(nextVolume);
        this.emitPurpose(KeyboardNavigationPurpose.VOLUME_UP);
        event.preventDefault();
        break;

      case KeyCodes.DOWN_ARROW:
        let prevVolume = this.getState().volume - SKIP_VOLUME_OFFSET;
        if (prevVolume < 0) {
          prevVolume = 0;
        }
        this.instance.setVolume(prevVolume);
        this.emitPurpose(KeyboardNavigationPurpose.VOLUME_DOWN);
        event.preventDefault();
        break;

      case KeyCodes.M:
        if (this.getState().volume > 0) {
          this.instance.setVolume(0);
        } else {
          this.instance.setVolume(1);
        }
        this.emitPurpose(KeyboardNavigationPurpose.TOGGLE_MUTE);
        event.preventDefault();
        break;

      case KeyCodes.F:
        const fullscreenExtension: FullscreenExtension = this.instance.getModule('FullscreenExtension') as FullscreenExtension;
        if (fullscreenExtension) {
          fullscreenExtension.toggleFullscreen();
          this.emitPurpose(KeyboardNavigationPurpose.TOGGLE_FULLSCREEN);
          event.preventDefault();
        }
        break;
    }
  };
}
