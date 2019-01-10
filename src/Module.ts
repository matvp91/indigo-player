import { Hookable } from '@src/Hooks';
import { Instance } from '@src/Instance';
import { EventCallback, EventData, IModule } from '@src/types';

@Hookable
export class Module implements IModule {
  public name = 'unknown';

  public hooks: any;

  protected instance: Instance;

  constructor(instance: Instance) {
    this.instance = instance;
  }

  public on(name: string, callback: EventCallback) {
    this.instance.on(name, callback);
  }

  public once(name: string, callback: EventCallback) {
    this.instance.on(name, callback);
  }

  public emit(name: string, eventData?: EventData) {
    this.instance.emit(name, eventData);
  }
}
