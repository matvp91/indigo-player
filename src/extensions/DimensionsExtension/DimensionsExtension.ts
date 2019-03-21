import { Module } from '@src/Module';
import { Events, IInstance, IDimensionsChangeEventData } from '@src/types';
import debounce from 'lodash/debounce';

import observeResize from 'simple-element-resize-detector';

export class DimensionsExtension extends Module {
  public name: string = 'DimensionsExtension';

  private observer: any;

  constructor(instance: IInstance) {
    super(instance);

    const debouncedOnResizeContainer = debounce(this.onResizeContainer, 250);
    this.observer = observeResize(instance.container, debouncedOnResizeContainer.bind(this));

    this.on(Events.READY, this.onReady.bind(this));
  }

  destroy() {
    this.observer.remove();
  }

  onReady() {
    this.onResizeContainer();
  }

  onResizeContainer() {
    const rect = this.instance.container.getBoundingClientRect();
    this.emit(Events.DIMENSIONS_CHANGE, {
      width: rect.width,
      height: rect.height,
    } as IDimensionsChangeEventData);
  }
}
