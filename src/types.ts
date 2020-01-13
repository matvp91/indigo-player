// Enums

export enum FormatTypes {
  MP4 = 'mp4',
  WEBM = 'webm',
  MOV = 'mov',
  DASH = 'dash',
  HLS = 'hls',
}

export enum ModuleLoaderTypes {
  EXTENSION,
  CONTROLLER,
  MEDIA,
  PLAYER,
}

export enum AdBreakType {
  PREROLL = 'preroll',
  MIDROLL = 'midroll',
  POSTROLL = 'postroll',
}

export enum Events {
  ERROR = 'error', // An unrecoverable error occured
  DESTROY = 'destroy',
  INSTANCE_INITIALIZE = 'instance:initialize', // booting the instance
  INSTANCE_INITIALIZED = 'instance:initialized', // controller, media & extensions are created
  READY = 'ready', // initial properties set (volume, startPosition, ...) and ready for playback

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
  PLAYER_STATE_SUBTITLECHANGE = 'player-state:subtitlechange',
  PLAYER_STATE_SUBTITLETEXTCHANGE = 'player-state:subtitletextchange',
  PLAYER_STATE_BUFFEREDCHANGE = 'player-state:bufferedchange',
  PLAYER_STATE_RATECHANGE = 'player-state:ratechange',

  // Media state events
  MEDIA_STATE_TRACKS = 'media-state:bitrates',
  MEDIA_STATE_TRACKCHANGE = 'media-state:bitratechange',
  MEDIA_STATE_AUDIOLANGUAGES = 'media-state:audiolanguages',
  MEDIA_STATE_AUDIOLANGUAGECHANGE = 'media-state:audiolanguagechange',

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
  PIP_CHANGE = 'pip:change',
  KEYBOARDNAVIGATION_KEYDOWN = 'keyboardnavigation:keydown',
  DIMENSIONS_CHANGE = 'dimensions:change',

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
  STATE_STARTED = 'state:started',
  STATE_CONTENT_STARTED = 'state:content-started',
  STATE_CONTENT_ENDED = 'state:content-ended',
  STATE_ENDED = 'state:ended',
  STATE_ERROR = 'state:error',
  STATE_BUFFERED_CHANGE = 'state:buffered',
  STATE_VOLUME_CHANGE = 'state:volume-change',
  STATE_DURATION_CHANGE = 'state:duration-change',
  STATE_FULLSCREEN_SUPPORTED = 'state:fullscreen-supported',
  STATE_FULLSCREEN_CHANGE = 'state:fullscreen-change',
  STATE_TRACKS = 'state:tracks',
  STATE_TRACK_CHANGE = 'state:track-change',
  STATE_SUBTITLE_CHANGE = 'state:subtitle-change',
  STATE_SUBTITLETEXT_CHANGE = 'state:subtitletext-change',
  STATE_SUBTITLESETTINGS_CHANGE = 'state:subtitlesettings-change',
  STATE_PLAYBACKRATE_CHANGE = 'state:playbackrate-change',
  STATE_PIP_CHANGE = 'state:pip-change',
  STATE_AUDIOLANGUAGES = 'state:audiolanguages',
  STATE_AUDIOLANGUAGE_CHANGE = 'state:audiolanguage-change',
  STATE_DIMENSIONS_CHANGE = 'state:dimensions-change',

  // UI
  UI_VISIBLECONTROLS_CHANGE = 'ui:visiblecontrols-change',
  UI_VIEW_CHANGE = 'ui:view-change',
  UI_STATE_CHANGE = 'ui:state-change',
}

export enum ErrorCodes {
  NO_SUPPORTED_FORMAT_FOUND = 1001,
  CONTROLLER_LOAD_FAILED = 1002,

  // Shaka
  SHAKA_CRITICAL_ERROR = 2001,

  // HLSjs
  HLSJS_CRITICAL_ERROR = 3001,
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

export interface Subtitle {
  label: string;
  srclang: string;
  src: string;
}

export type Cuepoint = 'preroll' | 'postroll' | number;

export interface Config {
  enableLogs: boolean;

  autoplay: boolean;
  keyboardNavigation: boolean | 'focus';

  aspectRatio?: number;
  volume?: number;
  startPosition?: number;

  ui: {
    enabled: boolean;
    lockControlsVisibility: boolean;
    locale: string;
    pip: boolean;
    image?: string;
    ignoreStylesheet?: boolean;
  };

  sources: Format[];

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

  subtitles: Subtitle[];

  thumbnails?: {
    src: string;
  };
}

export interface IThumbnail {
  start: number;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Adaptive tracks

export interface ITrack {
  id: number;
  width: number;
  height: number;
  bandwidth: number;
}

// Ads

export interface IAdBreak {
  sequenceIndex: number;
  id: string;
  type: AdBreakType;
  startsAt: number;
  duration: number;
  hasBeenWatched: boolean;
}

export interface IAd {
  sequenceIndex: number;
  freewheelAdInstance?: any;
}

// Env

export interface IEnv {
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

export type EventCallback = any;

export enum KeyboardNavigationPurpose {
  PAUSE = 'pause',
  PLAY = 'play',
  PREV_SEEK = 'prev-seek',
  NEXT_SEEK = 'next-seek',
  VOLUME_UP = 'volume-up',
  VOLUME_DOWN = 'volume-down',
  VOLUME_MUTED = 'volume-muted',
  VOLUME_UNMUTED = 'volume-unmuted',
  TOGGLE_FULLSCREEN = 'toggle-fullscreen',
  REQUEST_TOGGLE_SUBTITLES = 'toggle-subtitles',
  REQUEST_TOGGLE_MINIPLAYER = 'toggle-miniplayer',
}

export interface IDimensionsChangeEventData extends IEventData {
  width: number;
  height: number;
}

export interface IKeyboardNavigationKeyDownEventData extends IEventData {
  purpose: KeyboardNavigationPurpose;
}

export interface IPlaybackRateChangeEventData extends IEventData {
  playbackRate: number;
}

export interface IAudioLanguagesEventData extends IEventData {
  audioLanguages: string[];
}

export interface ITrackChangeEventData extends IEventData {
  track: ITrack;
  auto: boolean;
}

export interface ITracksEventData extends IEventData {
  tracks: ITrack[];
}

export interface IErrorEventData extends IEventData {
  error: IPlayerError;
}

export interface IDurationChangeEventData extends IEventData {
  duration: number;
}

export interface IBufferedChangeEventData extends IEventData {
  percentage: number;
}

export interface IVolumeChangeEventData extends IEventData {
  volume: number;
}

export interface ITimeUpdateEventData extends IEventData {
  currentTime: number;
}

export interface IAdBreakTimeUpdateEventData extends IEventData {
  currentTime: number;
}

export interface IAdBreaksEventData extends IEventData {
  adBreaks: IAdBreak[];
}

export interface IAdBreakEventData extends IEventData {
  adBreak: IAdBreak;
}

export interface IAdEventData extends IEventData {
  ad: IAd;
}

export interface IEventData {}

// Errors

export interface IPlayerError {
  code: ErrorCodes;
  underlyingError: Error;
}

// Hooks

export type NextHook = (...args: any) => void;

export interface IHooks {
  create(name: string, callback: NextHook);
}

// Modules

export interface IModuleLoader<T> {
  type: ModuleLoaderTypes;
  create(instance: IInstance): T;
  isSupported(
    instance: IInstance,
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

  hooks?: IHooks;

  instance: IInstance;

  on(name: string, callback: EventCallback);
  once(name: string, callback: EventCallback);
  emit(name: string, eventData?: IEventData);
}

export interface IController extends IModule {
  load();
  unload();

  play();
  pause();
  seekTo(time: number);
  setVolume(volume: number);
  selectTrack(track: ITrack);
  selectAudioLanguage(language: string);
  setPlaybackRate(playbackRate: number);
}

export interface IPlayer extends IModule {
  load();
  unload();

  setSource(src: string);

  play();
  pause();
  seekTo(time: number);
  setVolume(volume: number);
  setPlaybackRate(playbackRate: number);
}

export interface IMedia extends IModule {
  load();
  unload();

  play();
  pause();
  seekTo(time: number);
  setVolume(volume: number);
  selectTrack(track: ITrack);
  selectAudioLanguage(language: string);
  setPlaybackRate(playbackRate: number);
}

export type LogFunction = (...args: any) => void;

export interface IInstance {
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
}
