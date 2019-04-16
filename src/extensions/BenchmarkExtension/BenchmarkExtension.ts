import { Module } from '@src/Module';
import { Events, IInstance } from '@src/types';

const startTime = performance.now();

export class BenchmarkExtension extends Module {
  public name: string = 'BenchmarkExtension';

  public startupTimeExtension: number;

  public startupTimePlayer: number;

  public startupTimeInstance: number;

  public startupTimeWithAutoplay: number;

  constructor(instance: IInstance) {
    super(instance);

    this.startupTimeExtension = performance.now() - startTime;

    this.once(Events.INSTANCE_INITIALIZED, () => {
      this.startupTimeInstance = performance.now() - startTime;
    });

    if (instance.canAutoplay()) {
      this.once(Events.PLAYER_STATE_PLAYING, () => {
        this.startupTimeWithAutoplay = performance.now() - startTime;
      });
    }
  }
}
