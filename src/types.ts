import { Controller } from '@src/controller/Controller';
import { Instance } from '@src/Instance';
import { Player } from '@src/player/Player';
import { PlayerError } from '@src/PlayerError';
import { ListenerFn } from 'eventemitter3';

// GLOBALS
declare global {
  interface Window {
    ActiveXObject: any;
  }
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
  maxAds: number;
  freewheelSlot?: any;
}

export interface Ad {
  sequenceIndex: number;
  freewheelAdInstance?: any;
}

export type Cuepoint = AdBreakType | number;

export interface CaptionConfig {
  label: string;
  srclang: string;
  src: string;
}

export interface Config {
  autoplay: boolean;
  sources: Format[];
  showNativeControls: boolean;
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
  captions?: CaptionConfig[];
}

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

export enum FormatTypes {
  MP4 = 'mp4',
  WEBM = 'webm',
  MOV = 'mov',
  DASH = 'dash',
  HLS = 'hls',
}

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
  PLAYER_STATE_READY = 'player-state:ready',
  PLAYER_STATE_WAITING = 'player-state:waiting',
  PLAYER_STATE_VOLUMECHANGE = 'player-state:volumechange',

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
}

export enum ErrorCodes {
  NO_SUPPORTED_FORMAT_FOUND = 1001,
}

export type EventCallback = ListenerFn;

export interface TimeUpdateEventData {
  currentTime: number;
}

export interface VolumeChangeEventData {
  volume: number;
}

export interface ShakaInstanceEventData {
  shaka: any;
  player: any;
}

export interface ErrorEventData {
  error: PlayerError;
}

export interface AdBreaksEventData {
  adBreaks: AdBreak[];
}

export interface AdBreakEventData {
  adBreak: AdBreak;
}

export interface AdEventData {
  ad: Ad;
}

export interface FullscreenEventData {
  fullscreen: boolean;
}

export interface ReadyEventData {
  duration: number;
}

export interface StateChangeEventData {
  state: any;
  prevState: any;
}

export type EventData =
  | TimeUpdateEventData
  | VolumeChangeEventData
  | ShakaInstanceEventData
  | ErrorEventData
  | AdBreaksEventData
  | AdBreakEventData
  | FullscreenEventData
  | ReadyEventData
  | StateChangeEventData
  | AdEventData;

/**
 * Modules
 */
export enum ModuleLoaderTypes {
  EXTENSION,
  CONTROLLER,
  MEDIA,
  PLAYER,
}

export interface ModuleLoader<T> {
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
