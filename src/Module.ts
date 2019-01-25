import { Hookable } from '@src/Hooks';
import { EventCallback, IEventData, IInstance, IModule } from '@src/types';

@Hookable
export class Module implements IModule {
  public name = 'Unknown';

  public hooks: any;

  public instance: IInstance;

  constructor(instance: IInstance) {
    this.instance = instance;
  }

  public on(name: string, callback: EventCallback) {
    this.instance.on(name, callback);
  }

  public once(name: string, callback: EventCallback) {
    this.instance.on(name, callback);
  }

  public emit(name: string, eventData?: IEventData) {
    this.instance.emit(name, eventData);
  }
}
