import { Module } from '@src/Module';
import { Events, IEventData, IInstance } from '@src/types';
import './pip.scss';

interface IPipChangeEventData extends IEventData {
  pip: boolean;
}

export class PipExtension extends Module {
  public name: string = 'PipExtension';

  public pip: boolean = false;

  private playerContainer: HTMLElement;

  private playerContainerParent: HTMLElement;

  private pipPlaceholder: HTMLElement;

  private pipContainer: HTMLElement;

  private moveStartX: number;
  private moveStartY: number;

  private internalMoveDragging: any;
  private internalStopDragging: any;

  constructor(instance: IInstance) {
    super(instance);

    this.playerContainer = this.instance.container;
    this.playerContainerParent = this.instance.container.parentElement;
  }

  public enablePip() {
    const container = document.createElement('div');
    container.classList.add('ig_pip-container');

    const handler = document.createElement('div');
    handler.classList.add('ig_pip-handler');
    handler.addEventListener('mousedown', event => this.startDragging(event));
    container.appendChild(handler);

    const close = document.createElement('div');
    close.innerHTML = '&times;';
    close.classList.add('ig_pip-close');
    close.addEventListener('click', () => this.disablePip());
    container.appendChild(close);

    const placeholder = document.createElement('div');
    placeholder.classList.add('ig_pip-placeholder');
    this.playerContainerParent.appendChild(placeholder);

    this.pipPlaceholder = placeholder;
    this.pipContainer = container;

    container.appendChild(this.playerContainer);
    document.body.appendChild(container);

    this.pip = true;

    this.emit(Events.PIP_CHANGE, {
      pip: this.pip,
    } as IPipChangeEventData);
  }

  public disablePip() {
    this.playerContainerParent.appendChild(this.playerContainer);
    this.pipPlaceholder.parentElement.removeChild(this.pipPlaceholder);
    this.pipContainer.parentElement.removeChild(this.pipContainer);

    this.pip = false;

    this.emit(Events.PIP_CHANGE, {
      pip: this.pip,
    } as IPipChangeEventData);
  }

  public togglePip() {
    if (this.pip) {
      this.disablePip();
    } else {
      this.enablePip();
    }
  }

  private startDragging(event) {
    event.preventDefault();

    this.moveStartX = event.clientX;
    this.moveStartY = event.clientY;

    this.internalMoveDragging = event => this.moveDragging(event);
    document.addEventListener('mousemove', this.internalMoveDragging);
    this.internalStopDragging = event => this.stopDragging(event);
    document.addEventListener('mouseup', this.internalStopDragging);
  }

  private moveDragging(event) {
    event.preventDefault();

    const diffX = this.moveStartX - event.clientX;
    this.pipContainer.style.left = `${this.pipContainer.offsetLeft - diffX}px`;

    const diffY = this.moveStartY - event.clientY;
    this.pipContainer.style.top = `${this.pipContainer.offsetTop - diffY}px`;

    this.moveStartX = event.clientX;
    this.moveStartY = event.clientY;
  }

  private stopDragging(event) {
    document.removeEventListener('mousemove', this.internalMoveDragging);
    document.removeEventListener('mouseup', this.internalStopDragging);
  }
}
