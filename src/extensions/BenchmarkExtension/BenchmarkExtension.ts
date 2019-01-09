import { Instance } from '@src/Instance';
import { Module } from '@src/Module';
import { Events } from '@src/types';

const startTime = performance.now();

export class BenchmarkExtension extends Module {
  public name = 'benchmark';

  public startupTimeExtension: number;

  public startupTimePlayer: number;

  public startupTimeInstance: number;

  public startupTimeWithAutoplay: number;

  constructor(instance: Instance) {
    super(instance);

    this.startupTimeExtension = performance.now() - startTime;

    this.once(Events.PLAYER_STATE_READY, () => {
      this.startupTimePlayer = performance.now() - startTime;
    });

    this.once(Events.READY, () => {
      this.startupTimeInstance = performance.now() - startTime;
    });

    if (instance.canAutoplay()) {
      this.once(Events.PLAYER_STATE_PLAYING, () => {
        this.startupTimeWithAutoplay = performance.now() - startTime;
      });
    }
  }
}
