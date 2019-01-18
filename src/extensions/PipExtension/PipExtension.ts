import { Instance } from '@src/Instance';
import { Module } from '@src/Module';
import { Events } from '@src/types';
import { addStyle } from '@src/utils/addStyle';

import './pip.scss';

export class PipExtension extends Module {
  public name: string = 'PipExtension';

  private playerContainer: HTMLElement;

  private playerContainerParent: HTMLElement;

  private pipPlaceholder: HTMLElement;

  private pipContainer: HTMLElement;

  private moveStartX: number;
  private moveStartY: number;

  private internalMoveDragging: any;
  private internalStopDragging: any;

  constructor(instance: Instance) {
    super(instance);

    this.playerContainer = this.instance.container;
    this.playerContainerParent = this.instance.container.parentElement;
  }

  enablePip() {
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
  }

  disablePip() {
    this.playerContainerParent.appendChild(this.playerContainer);
    this.pipPlaceholder.parentElement.removeChild(this.pipPlaceholder);
    this.pipContainer.parentElement.removeChild(this.pipContainer);
  }

  startDragging(event) {
    event.preventDefault();

    this.moveStartX = event.clientX;
    this.moveStartY = event.clientY;

    this.internalMoveDragging = event => this.moveDragging(event);
    document.addEventListener('mousemove', this.internalMoveDragging);
    this.internalStopDragging = event => this.stopDragging(event);
    document.addEventListener('mouseup', this.internalStopDragging);
  }

  moveDragging(event) {
    event.preventDefault();

    const diffX = this.moveStartX - event.clientX;
    this.pipContainer.style.left = `${this.pipContainer.offsetLeft - diffX}px`;

    const diffY = this.moveStartY - event.clientY;
    this.pipContainer.style.top = `${this.pipContainer.offsetTop - diffY}px`;

    this.moveStartX = event.clientX;
    this.moveStartY = event.clientY;
  }

  stopDragging(event) {
    document.removeEventListener('mousemove', this.internalMoveDragging);
    document.removeEventListener('mouseup', this.internalStopDragging);
  }
}
