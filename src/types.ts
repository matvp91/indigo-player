import { Controller } from '@src/controller/Controller';
import { Instance } from '@src/Instance';
import { Player } from '@src/player/Player';
import { PlayerError } from '@src/PlayerError';
import { ListenerFn } from 'eventemitter3';

export enum FormatTypes {
  MP4 = 'mp4',
  WEBM = 'webm',
  MOV = 'mov',
  DASH = 'dash',
  HLS = 'hls',
}

export interface Format {
  type: FormatTypes;
  src: string;
  drm?: {
    widevine?: {
      licenseUrl: string;
    };
    playready?: {
      licenseUrl: string;
    };
  };
}

export interface Caption {
  label: string;
  srclang: string;
  src: string;
}

export type Cuepoint = 'preroll' | 'postroll' | number;

export interface Config {
  autoplay: boolean;
  ui: boolean;
  sources: Format[];
  showNativeControls: boolean;
  ignorePolyfills: boolean;
  freewheel?: {
    clientSide: boolean;
    server: string;
    videoAsset: string;
    duration: number;
    network: number;
    siteSection: string;
    profile: string;
    cuepoints: Cuepoint[];
  };
  googleIMA?: {
    src: string;
  };
  captions?: Caption[];
}

// ADS

export enum AdBreakType {
  PREROLL = 'preroll',
  MIDROLL = 'midroll',
  POSTROLL = 'postroll',
}

export interface AdBreak {
  sequenceIndex: number;
  id: string;
  type: AdBreakType;
  startsAt: number;
  hasBeenWatched: boolean;
}

export interface FreeWheelAdBreak extends AdBreak {
  maxAds: number;
  freewheelSlot?: any;
}

export interface GoogleIMAAdBreak extends AdBreak {
  googleIMAAd?: any;
}

export interface Ad {
  sequenceIndex: number;
  freewheelAdInstance?: any;
}

// Env

export interface Env {
  // Browser support
  isSafari: boolean;
  isEdge: boolean;
  isIE: boolean;
  isChrome: boolean;
  isMobile: boolean;
  isIOS: boolean;
  isFacebook: boolean;

  // Autoplay
  canAutoplay: boolean;
}

// Events

export enum Events {
  ERROR = 'error', // An unrecoverable error occured
  DESTROY = 'destroy',
  READY = 'ready',

  // Player state events
  PLAYER_STATE_PLAY = 'player-state:play',
  PLAYER_STATE_PAUSE = 'player-state:pause',
  PLAYER_STATE_PLAYING = 'player-state:playing',
  PLAYER_STATE_ENDED = 'player-state:ended',
  PLAYER_STATE_SEEKED = 'player-state:seeked',
  PLAYER_STATE_TIMEUPDATE = 'player-state:timeupdate',
  PLAYER_STATE_DURATIONCHANGE = 'player-state:durationchange',
  PLAYER_STATE_READY = 'player-state:ready',
  PLAYER_STATE_WAITING = 'player-state:waiting',
  PLAYER_STATE_VOLUMECHANGE = 'player-state:volumechange',
  PLAYER_STATE_CAPTIONSCHANGE = 'player-state:captionschange',
  PLAYER_STATE_BUFFEREDCHANGE = 'player-state:bufferedchange',

  // Shaka
  SHAKA_INSTANCE = 'shaka:instance',

  // Ads
  ADBREAKS = 'ad:adbreaks',
  ADBREAK_STARTED = 'ad:adbreak-started',
  ADBREAK_ENDED = 'ad:adbreak-ended',
  ADBREAK_STATE_TIMEUPDATE = 'ad-state:adbreak-timeupdate',
  ADBREAK_STATE_PLAY = 'ad-state:adbreak-play',
  ADBREAK_STATE_PAUSE = 'ad-state:adbreak-pause',
  ADBREAK_STATE_PLAYING = 'ad-state:adbreak-playing',
  ADBREAK_STATE_BUFFERING = 'ad-state:adbreak-buffering',
  AD_STARTED = 'ad:ad-started',
  AD_ENDED = 'ad:ad-ended',

  // Misc
  FULLSCREEN_SUPPORTED = 'fullscreen:supported',
  FULLSCREEN_CHANGE = 'fullscreen:change',

  // State
  STATE_CHANGE = 'state:change',
  STATE_READY = 'state:ready',
  STATE_PLAY_REQUESTED = 'state:playrequested',
  STATE_PLAYING = 'state:playing',
  STATE_PAUSED = 'state:paused',
  STATE_CURRENTTIME_CHANGE = 'state:currenttime-change',
  STATE_BUFFERING = 'state:buffering',
  STATE_ADBREAKS = 'state:adbreaks',
  STATE_ADBREAK_STARTED = 'state:adbreak-started',
  STATE_ADBREAK_ENDED = 'state:adbreak-ended',
  STATE_AD_STARTED = 'state:ad-started',
  STATE_AD_ENDED = 'state:ad-ended',
  STATE_ENDED = 'state:ended',
  STATE_ERROR = 'state:error',
  STATE_BUFFERED = 'state:buffered',
  STATE_VOLUMECHANGE = 'state:volume-change',
  STATE_DURATION_CHANGE = 'state:duration-change',
  STATE_FULLSCREEN_SUPPORTED = 'state:fullscreen-supported',
  STATE_FULLSCREEN_CHANGED = 'state:fullscreen-changed',
}

export type EventCallback = ListenerFn;

export type TimeUpdateEventData = {
  currentTime: number;
};

export type VolumeChangeEventData = {
  volume: number;
};

export type ShakaInstanceEventData = {
  shaka: any;
  player: any;
};

export type ErrorEventData = {
  error: PlayerError;
};

export type AdBreaksEventData = {
  adBreaks: AdBreak[];
};

export type AdBreakEventData = {
  adBreak: AdBreak;
};

export type AdEventData = {
  ad: Ad;
};

export type FullscreenEventData = {
  fullscreen: boolean;
};

export type DurationChangeEventData = {
  duration: number;
};

export type StateChangeEventData = {
  state: any;
  prevState: any;
};

export type CaptionsChangeEventData = {
  srclang: string;
};

export type BufferedChangeEventData = {
  percentage: number;
};

export type EventData =
  | TimeUpdateEventData
  | VolumeChangeEventData
  | ShakaInstanceEventData
  | ErrorEventData
  | AdBreaksEventData
  | AdBreakEventData
  | FullscreenEventData
  | DurationChangeEventData
  | StateChangeEventData
  | AdEventData
  | CaptionsChangeEventData
  | BufferedChangeEventData;

// Errors

export enum ErrorCodes {
  NO_SUPPORTED_FORMAT_FOUND = 1001,
}

// Modules

export enum ModuleLoaderTypes {
  EXTENSION,
  CONTROLLER,
  MEDIA,
  PLAYER,
}

export interface IModuleLoader<T> {
  type: ModuleLoaderTypes;
  create(instance: Instance): T | Promise<T>;
  isSupported(
    instance: Instance,
    isSupportedArgs?: any,
  ): boolean | Promise<boolean>;
}

/**
 * Addition types
 * Used to keep a structure of each addition type such as the player,
 * a media element (HLSjs, Shaka, ...), the controller and the general instance.
 */
export interface IModule {
  name: string;

  hooks?: (...args: any) => void;

  on(name: string, callback: EventCallback);
  once(name: string, callback: EventCallback);
  emit(name: string, eventData?: EventData);
}

export interface IController extends IModule {
  boot(): Promise<any>;
  load(format: Format);
  unload();

  play();
  pause();
  seekTo(time: number);
  setVolume(volume: number);
}

export interface IPlayer extends IModule {
  load();
  unload();

  setSource(src: string);

  play();
  pause();
  seekTo(time: number);
  setVolume(volume: number);
}

export interface IMedia extends IModule {
  load(format: Format);
  unload();

  play();
  pause();
  seekTo(time: number);
  setVolume(volume: number);
}

export interface IInstance {
  config: Config;
  container: HTMLElement;
  playerContainer: HTMLElement;

  controller: Controller;
  player: Player;

  // Methods
  play();
  pause();
  seekTo(time: number);
  setVolume(volume: number);
  destroy();
}
