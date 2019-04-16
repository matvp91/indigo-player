import { createConfig } from '@src/createConfig';
import { createAllSupported, createFirstSupported } from '@src/ModuleLoader';
import { PlayerError } from '@src/PlayerError';
import { selectController, selectExtensions } from '@src/selectModule';
import '@src/styles.scss';
import {
  Config,
  ErrorCodes,
  EventCallback,
  Events,
  Format,
  IController,
  IEnv,
  IErrorEventData,
  IEventData,
  IInstance,
  IMedia,
  IModule,
  IPlayer,
  IPlayerError,
  ITrack,
  ModuleLoaderTypes,
} from '@src/types';
import { getEnv } from '@src/utils/getEnv';
import { log } from '@src/utils/log';
import { storage } from '@src/utils/storage';
import EventEmitter from 'eventemitter3';
import find from 'lodash/find';
import isElement from 'lodash/isElement';
import isString from 'lodash/isString';

declare var __webpack_public_path__: string;

export class Instance implements IInstance {
  /**
   * The initial player config.
   * @type {Config}
   */
  public config: Config;

  /**
   * The root container.
   * @type {HTMLElement}
   */
  public container: HTMLElement;

  /**
   * Container specifically for the video element.
   * @type {HTMLElement}
   */
  public playerContainer: HTMLElement;

  public adsContainer: HTMLElement;

  public uiContainer: HTMLElement;

  public env: IEnv;

  public controller: IController;

  public player: IPlayer;

  public media: IMedia;

  public format: Format;

  public extensions: IModule[] = [];

  public log = log;

  public storage = storage;

  /**
   * Allow the instance to emit and listen to events.
   * @type {EventEmitter}
   */
  private emitter: EventEmitter;

  constructor(element: HTMLElement | string, config: Config) {
    this.config = createConfig(config);

    this.createContainers(element, this.config.aspectRatio);

    this.emitter = new EventEmitter();

    this.init(this.config);
  }

  public on = (name: string, callback: EventCallback) =>
    this.emitter.on(name, callback);

  public once = (name: string, callback: EventCallback) =>
    this.emitter.once(name, callback);

  public removeListener = (name: string, callback: EventCallback) =>
    this.emitter.removeListener(name, callback);

  public emit = (name: string, eventData?: IEventData) =>
    this.emitter.emit(name, eventData);

  public play() {
    this.controller.play();
  }

  public pause() {
    this.controller.pause();
  }

  public seekTo(time: number) {
    this.controller.seekTo(time);
  }

  public setVolume(volume: number) {
    this.controller.setVolume(volume);
  }

  public selectTrack(track: ITrack) {
    this.controller.selectTrack(track);
  }

  public selectAudioLanguage(language: string) {
    this.controller.selectAudioLanguage(language);
  }

  public setPlaybackRate(playbackRate: number) {
    this.controller.setPlaybackRate(playbackRate);
  }

  public setError(error: IPlayerError) {
    if (this.controller) {
      this.controller.unload();
    }
    this.emit(Events.ERROR, {
      error,
    } as IErrorEventData);
  }

  public canAutoplay(): boolean {
    return this.config.autoplay && this.env.canAutoplay;
  }

  public destroy() {
    this.emit(Events.DESTROY);

    this.emitter.removeAllListeners();

    this.controller.unload();

    this.controller = null;
    this.player = null;
    this.format = null;
    this.media = null;

    const div: HTMLElement = this.container;
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }

    this.container.remove();
  }

  public getStats() {
    return {
      config: this.config,
      controller: [this.controller.name, this.controller],
      media: [this.media.name, this.media],
      player: [this.player.name, this.player],
      extensions: this.extensions.map(extension => [extension.name, extension]),
    };
  }

  public getModule(name: string): IModule {
    const modules = [
      ...this.extensions,
      this.controller,
      this.media,
      this.player,
    ];

    return find(modules, { name });
  }

  private createContainers(element: HTMLElement | string, aspectRatio: number) {
    if (isString(element)) {
      element = document.getElementById(element);
    }

    if (!isElement(element)) {
      throw new PlayerError(
        'The provided element is not a valid selector or DOM element.',
      );
    }

    this.container = document.createElement('div');
    this.container.classList.add('ig-container');
    this.container.style.paddingTop = `${100 / aspectRatio}%`;

    this.playerContainer = document.createElement('div');
    this.playerContainer.classList.add('ig-player');
    this.container.appendChild(this.playerContainer);

    this.adsContainer = document.createElement('div');
    this.adsContainer.classList.add('ig-ads');
    this.container.appendChild(this.adsContainer);

    this.uiContainer = document.createElement('div');
    this.uiContainer.classList.add('ig-ui');
    this.container.appendChild(this.uiContainer);

    element.appendChild(this.container);
  }

  private async init(config: Config) {
    this.emit(Events.INSTANCE_INITIALIZE);

    const log = this.log('instance.init');

    log(`Will fetch chunks from ${__webpack_public_path__}`);

    this.env = await getEnv(config);

    this.controller = await selectController(this);
    log('Controller selected', { controller: this.controller });

    this.extensions = await selectExtensions(this);
    log('Extensions loaded', { extensions: this.extensions });

    try {
      await this.controller.load();

      log('Controller loaded');
    } catch (error) {
      if (error instanceof PlayerError) {
        this.setError(error);
      } else {
        this.setError(
          new PlayerError(ErrorCodes.CONTROLLER_LOAD_FAILED, error),
        );
      }
      return;
    }

    this.emit(Events.INSTANCE_INITIALIZED);

    // Set initial config values.
    this.setVolume(config.volume);
    if (config.startPosition) {
      this.seekTo(config.startPosition);
    }

    // Now that we know we can autoplay, actually do it.
    if (this.canAutoplay()) {
      this.play();
      log('play() called because of autoplay');
    }

    setTimeout(() => this.emit(Events.READY));
  }
}
