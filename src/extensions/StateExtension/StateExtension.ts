import { Module } from '@src/Module';
import { PlayerError } from '@src/PlayerError';
import {
  AdBreakType,
  Events,
  IEventData,
  IInstance,
  ITrack,
  Subtitle,
} from '@src/types';
import produce from 'immer';
import find from 'lodash/find';

export interface IState {
  ready: boolean;
  videoSessionStarted: boolean;
  waitingForUser: boolean;

  playRequested: boolean;
  playing: boolean;
  paused: boolean;
  buffering: boolean;
  ended: boolean;

  currentTime: number;
  duration: number;

  adBreaks: any;
  adBreak: any;
  adBreakCurrentTime: number;
  ad: any;

  error: PlayerError;

  bufferedPercentage: number;
  volume: number;

  fullscreenSupported: boolean;
  fullscreen: boolean;

  pip: boolean;

  started: boolean;

  tracks: ITrack[];
  track: ITrack;
  trackAutoSwitch: boolean;

  subtitle: Subtitle;
  subtitleText: string;

  playbackRate: number;

  audioLanguages: string[];

  width: number;
  height: number;
}

interface IStateChangeEventData extends IEventData {
  state: IState;
  prevState: IState;
}

export class StateExtension extends Module {
  public name: string = 'StateExtension';

  private state: IState = {
    ready: false,
    videoSessionStarted: false,
    waitingForUser: false,

    playRequested: false,
    playing: false,
    paused: false,
    buffering: false,
    ended: false,

    currentTime: null,
    duration: null,

    adBreaks: [],
    adBreak: null,
    adBreakCurrentTime: null,
    ad: null,

    error: null,

    bufferedPercentage: 0,
    volume: 1,

    fullscreenSupported: false,
    fullscreen: false,

    pip: false,

    started: false,

    tracks: [],
    track: null,
    trackAutoSwitch: false,

    subtitle: null,
    subtitleText: null,

    playbackRate: 1,

    audioLanguages: [],

    width: null,
    height: null,
  };

  constructor(instance: IInstance) {
    super(instance);

    const setReady = this.dispatch((draft, data) => {
      draft.ready = true;
      draft.waitingForUser = !instance.canAutoplay();
    }, Events.STATE_READY);
    this.on(Events.READY, setReady);

    const setPlayRequested = this.dispatch(draft => {
      draft.waitingForUser = false;
      draft.playRequested = true;
      draft.paused = false;
      draft.videoSessionStarted = true;
    }, Events.STATE_PLAY_REQUESTED);
    this.on(Events.PLAYER_STATE_PLAY, setPlayRequested);
    this.on(Events.ADBREAK_STATE_PLAY, setPlayRequested);

    const setPlaying = this.dispatch(draft => {
      draft.started = true;
      draft.playing = true;
      draft.playRequested = true;
      draft.buffering = false;
      draft.paused = false;
    }, Events.STATE_PLAYING);
    this.on(Events.PLAYER_STATE_PLAYING, setPlaying);
    this.on(Events.ADBREAK_STATE_PLAYING, setPlaying);

    const setPaused = this.dispatch(draft => {
      draft.playRequested = false;
      draft.playing = false;
      draft.paused = true;
    }, Events.STATE_PAUSED);
    this.on(Events.PLAYER_STATE_PAUSE, () => {
      // If an adbreak plays, we don't care if the media is paused or not.
      if (this.state.adBreak) {
        return;
      }
      setPaused();
    });
    this.on(Events.ADBREAK_STATE_PAUSE, setPaused);

    const setCurrentTime = this.dispatch((draft, data) => {
      draft.currentTime = data.currentTime;
      draft.buffering = false;
      draft.playing = true;
    }, Events.STATE_CURRENTTIME_CHANGE);
    this.on(Events.PLAYER_STATE_TIMEUPDATE, setCurrentTime);

    const setDuraton = this.dispatch((draft, data) => {
      draft.duration = data.duration;
    }, Events.STATE_DURATION_CHANGE);
    this.on(Events.PLAYER_STATE_DURATIONCHANGE, setDuraton);

    const setAdBreakCurrentTime = this.dispatch((draft, data) => {
      draft.adBreakCurrentTime = data.currentTime;
    }, Events.STATE_CURRENTTIME_CHANGE);
    this.on(Events.ADBREAK_STATE_TIMEUPDATE, setAdBreakCurrentTime);

    const setBuffering = this.dispatch(draft => {
      draft.playing = false;
      draft.buffering = true;
    }, Events.STATE_BUFFERING);
    this.on(Events.PLAYER_STATE_WAITING, setBuffering);

    const setAdBreaks = this.dispatch((draft, data) => {
      draft.adBreaks = data.adBreaks;
    }, Events.STATE_ADBREAKS);
    this.on(Events.ADBREAKS, setAdBreaks);

    const setAdBreak = this.dispatch((draft, data) => {
      draft.adBreak = data.adBreak;
    }, Events.STATE_ADBREAK_STARTED);
    this.on(Events.ADBREAK_STARTED, setAdBreak);

    const resetAdBreak = this.dispatch(draft => {
      draft.adBreak = null;
      draft.adBreakCurrentTime = null;
    }, Events.STATE_ADBREAK_ENDED);
    this.on(Events.ADBREAK_ENDED, resetAdBreak);

    const setAd = this.dispatch((draft, data) => {
      draft.ad = data.ad;
    }, Events.STATE_AD_STARTED);
    this.on(Events.AD_STARTED, setAd);

    const resetAd = this.dispatch(draft => {
      draft.ad = null;
    }, Events.STATE_AD_ENDED);
    this.on(Events.AD_ENDED, resetAd);

    const setEnded = this.dispatch(draft => {
      draft.started = false;
      draft.playRequested = false;
      draft.playing = false;
      draft.ended = true;
    }, Events.STATE_ENDED);
    this.on(Events.PLAYER_STATE_ENDED, () => {
      // If the player ended, but we still have a postroll to play, do not set it to ended.
      if (find(this.state.adBreaks, { type: AdBreakType.POSTROLL })) {
        return;
      }

      setEnded();
    });
    this.on(Events.ADBREAK_ENDED, (data: any) => {
      if (data.adBreak.type === AdBreakType.POSTROLL) {
        setEnded();
      }
    });

    const setBufferedPercentage = this.dispatch((draft, data) => {
      draft.bufferedPercentage = data.percentage;
    }, Events.STATE_BUFFERED_CHANGE);
    this.on(Events.PLAYER_STATE_BUFFEREDCHANGE, setBufferedPercentage);

    const setError = this.dispatch((draft, data) => {
      draft.error = data.error;
    }, Events.STATE_ERROR);
    this.on(Events.ERROR, setError);

    const setVolume = this.dispatch((draft, data) => {
      draft.volume = data.volume;
    }, Events.STATE_VOLUME_CHANGE);
    this.on(Events.PLAYER_STATE_VOLUMECHANGE, setVolume);

    const setFullscreenSupported = this.dispatch(draft => {
      draft.fullscreenSupported = true;
    }, Events.STATE_FULLSCREEN_SUPPORTED);
    this.on(Events.FULLSCREEN_SUPPORTED, setFullscreenSupported);

    const setFullscreenChanged = this.dispatch((draft, data) => {
      draft.fullscreen = data.fullscreen;
    }, Events.STATE_FULLSCREEN_CHANGE);
    this.on(Events.FULLSCREEN_CHANGE, setFullscreenChanged);

    const setTracks = this.dispatch((draft, data) => {
      draft.tracks = data.tracks;
    }, Events.STATE_TRACKS);
    this.on(Events.MEDIA_STATE_TRACKS, setTracks);

    const setTrack = this.dispatch((draft, data) => {
      draft.track = data.track;
      draft.trackAutoSwitch = data.auto;
    }, Events.STATE_TRACK_CHANGE);
    this.on(Events.MEDIA_STATE_TRACKCHANGE, setTrack);

    const setSubtitle = this.dispatch((draft, data) => {
      draft.subtitle = data.subtitle;
    }, Events.STATE_SUBTITLE_CHANGE);
    this.on(Events.PLAYER_STATE_SUBTITLECHANGE, setSubtitle);

    const setSubtitleText = this.dispatch((draft, data) => {
      draft.subtitleText = data.text;
    }, Events.STATE_SUBTITLETEXT_CHANGE);
    this.on(Events.PLAYER_STATE_SUBTITLETEXTCHANGE, setSubtitleText);

    const setPlaybackRate = this.dispatch((draft, data) => {
      draft.playbackRate = data.playbackRate;
    }, Events.STATE_PLAYBACKRATE_CHANGE);
    this.on(Events.PLAYER_STATE_RATECHANGE, setPlaybackRate);

    const setPip = this.dispatch((draft, data) => {
      draft.pip = data.pip;
    }, Events.STATE_PIP_CHANGE);
    this.on(Events.PIP_CHANGE, setPip);

    const setAudioLanguages = this.dispatch((draft, data) => {
      draft.audioLanguages = data.audioLanguages;
    }, Events.STATE_AUDIOLANGUAGES);
    this.on(Events.MEDIA_STATE_AUDIOLANGUAGES, setAudioLanguages);

    this.emit(Events.STATE_CHANGE, {
      state: this.state,
      prevState: null,
    } as IStateChangeEventData);

    const setDimensions = this.dispatch((draft, data) => {
      draft.width = data.width;
      draft.height = data.height;
    }, Events.STATE_DIMENSIONS_CHANGE);
    this.on(Events.DIMENSIONS_CHANGE, setDimensions);
  }

  public getState(): IState {
    return this.state;
  }

  public dispatch = (fn, emitEvent: Events) => {
    return (data?: any) => {
      const newState = produce(this.state, draft => {
        fn(draft, data);
        return draft;
      });

      if (newState === this.state) {
        return;
      }

      const prevState = this.state;
      this.state = newState;

      this.emit(emitEvent, {
        state: this.state,
        prevState,
      } as IStateChangeEventData);

      this.emit(Events.STATE_CHANGE, {
        state: this.state,
        prevState,
      } as IStateChangeEventData);
    };
  };
}
