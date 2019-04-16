import { IInstance } from '../../src/types';
import { any } from 'prop-types';

/**
 config: Config;
  container: HTMLElement;
  playerContainer: HTMLElement;
  uiContainer: HTMLElement;
  adsContainer: HTMLElement;

  env: IEnv;
  controller: IController;
  player: IPlayer;
  media: IMedia;
  format: Format;
  extensions: IModule[];

  storage: any; // TODO: Proper type
  log(namespace: string): LogFunction;

  // Methods
  play();
  pause();
  seekTo(time: number);
  setVolume(volume: number);
  selectTrack(track: ITrack);
  selectAudioLanguage(language: string);
  setPlaybackRate(playbackRate: number);
  destroy();

  on(name: string, callback: EventCallback);
  once(name: string, callback: EventCallback);
  removeListener(name: string, callback: EventCallback);
  emit(name: string, eventData?: IEventData);

  setError(error: IPlayerError);
  canAutoplay(): boolean;

  getModule(name: string): IModule;
  getStats(): any;
 */

export class Instance implements IInstance {
  config = {} as any;
  container = null as any;
  playerContainer = null as any;
  uiContainer = null as any;
  adsContainer = null as any;
  env = null as any;
  controller = null as any;
  player = null as any;
  media = null as any;
  format = null as any;
  extensions = [];
  storage = null as any;
  log = () => () => {};

  play() {}
  pause() {}
  seekTo(time: number) {}
  setVolume(volume: number) {}
  selectTrack(track: any) {}
  selectAudioLanguage(language: string) {}
  setPlaybackRate(playbackRate: number) {}
  destroy() {}

  setError(error: any) {}
  canAutoplay() {
    return null;
  }

  getModule(name: string) {
    return null;
  }
  getStats() {
    return null;
  }

  events = {};
  calledEvents = [];
  on(name, callback) {
    this.events[name] = callback;
  }
  once(name, callback) {
    const onceCallback = (...args) => {
      delete this.events[name];
      callback(...args);
    };
    this.on(name, onceCallback);
  }
  removeListener(name, callback) {
    delete this.events[name];
  }

  emit = jest.fn((name, data) => {
    this.calledEvents.push(name);
    if (this.events[name]) {
      this.events[name](data);
    }
  });
}
