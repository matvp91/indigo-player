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
  started: boolean;
  contentStarted: boolean;
  contentEnded: boolean;
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
    started: false,
    ended: false,
    contentStarted: false,
    contentEnded: false,

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

    // CONTENT STATE

    // ready
    this.on(
      Events.READY,
      this.dispatch(draft => {
        draft.ready = true;
        draft.waitingForUser = !instance.canAutoplay(); // TODO: implement data.canAutoplay
      }),
    );

    // playRequested
    this.on(
      Events.PLAYER_STATE_PLAY,
      this.dispatch(draft => {
        draft.waitingForUser = false;
        draft.playRequested = true;
        draft.paused = false;
        draft.videoSessionStarted = true;
      }),
    );
    this.on(
      Events.ADBREAK_STATE_PLAY,
      this.dispatch(draft => {
        draft.waitingForUser = false;
        draft.playRequested = true;
        draft.paused = false;
        draft.videoSessionStarted = true;
      }),
    );

    // // playing
    this.on(
      Events.PLAYER_STATE_PLAYING,
      this.dispatch(draft => {
        if (this.state.adBreak) {
          return;
        }

        draft.started = true;
        draft.playing = true;
        draft.playRequested = true;
        draft.buffering = false;
        draft.paused = false;
        draft.ended = false;
        draft.contentStarted = true;
      }),
    );
    this.on(
      Events.ADBREAK_STATE_PLAYING,
      this.dispatch(draft => {
        if (!this.state.adBreak) {
          return;
        }

        draft.started = true;
        draft.playing = true;
        draft.playRequested = true;
        draft.buffering = false;
        draft.paused = false;
        draft.ended = false;
      }),
    );

    // paused
    this.on(
      Events.PLAYER_STATE_PAUSE,
      this.dispatch(draft => {
        if (this.state.adBreak) {
          return;
        }

        draft.playRequested = false;
        draft.playing = false;
        draft.paused = true;
      }),
    );
    this.on(
      Events.ADBREAK_STATE_PAUSE,
      this.dispatch(draft => {
        if (!this.state.adBreak) {
          return;
        }

        draft.playRequested = false;
        draft.playing = false;
        draft.paused = true;
      }),
    );

    // currentTime
    this.on(
      Events.PLAYER_STATE_TIMEUPDATE,
      this.dispatch((draft, data) => {
        if (this.state.adBreak) {
          return;
        }

        draft.currentTime = data.currentTime;
      }),
    );

    // duration
    this.on(
      Events.PLAYER_STATE_DURATIONCHANGE,
      this.dispatch((draft, data) => {
        draft.duration = data.duration;
      }),
    );

    // buffering
    this.on(
      Events.PLAYER_STATE_WAITING,
      this.dispatch(draft => {
        draft.playing = false;
        draft.buffering = true;
      }),
    );

    // AD RELATED STATE

    // adBreakCurrentTime
    this.on(
      Events.ADBREAK_STATE_TIMEUPDATE,
      this.dispatch((draft, data) => {
        if (!this.state.adBreak) {
          return;
        }

        draft.adBreakCurrentTime = data.currentTime;
      }),
    );

    this.on(
      Events.ADBREAKS,
      this.dispatch((draft, data) => {
        draft.adBreaks = data.adBreaks;
      }),
    );

    this.on(
      Events.ADBREAK_STARTED,
      this.dispatch((draft, data) => {
        draft.adBreak = data.adBreak;
      }),
    );

    this.on(
      Events.ADBREAK_ENDED,
      this.dispatch(draft => {
        draft.adBreak = null;
        draft.adBreakCurrentTime = null;
      }),
    );

    this.on(
      Events.AD_STARTED,
      this.dispatch((draft, data) => {
        draft.ad = data.ad;
      }),
    );

    this.on(
      Events.AD_ENDED,
      this.dispatch(draft => {
        draft.ad = null;
      }),
    );

    this.on(
      Events.PLAYER_STATE_ENDED,
      this.dispatch(draft => {
        draft.contentStarted = false;
        draft.contentEnded = true;

        // If we can't find a postroll, everything is ended
        if (!find(this.state.adBreaks, { type: AdBreakType.POSTROLL })) {
          draft.started = false;
          draft.playRequested = false;
          draft.playing = false;
          draft.ended = true;
        }
      }),
    );

    this.on(
      Events.ADBREAK_ENDED,
      this.dispatch((draft, data) => {
        if (data.adBreak.type === AdBreakType.POSTROLL) {
          draft.started = false;
          draft.playRequested = false;
          draft.playing = false;
          draft.ended = true;
        }
      }),
    );

    this.on(
      Events.PLAYER_STATE_BUFFEREDCHANGE,
      this.dispatch((draft, data) => {
        draft.bufferedPercentage = data.percentage;
      }),
    );

    this.on(
      Events.ERROR,
      this.dispatch((draft, data) => {
        draft.error = data.error;
      }),
    );

    const setVolume = this.dispatch((draft, data) => {
      draft.volume = data.volume;
    });
    this.on(Events.PLAYER_STATE_VOLUMECHANGE, setVolume);

    const setFullscreenSupported = this.dispatch(draft => {
      draft.fullscreenSupported = true;
    });
    this.on(Events.FULLSCREEN_SUPPORTED, setFullscreenSupported);

    const setFullscreenChanged = this.dispatch((draft, data) => {
      draft.fullscreen = data.fullscreen;
    });
    this.on(Events.FULLSCREEN_CHANGE, setFullscreenChanged);

    const setTracks = this.dispatch((draft, data) => {
      draft.tracks = data.tracks;
    });
    this.on(Events.MEDIA_STATE_TRACKS, setTracks);

    const setTrack = this.dispatch((draft, data) => {
      draft.track = data.track;
      draft.trackAutoSwitch = data.auto;
    });
    this.on(Events.MEDIA_STATE_TRACKCHANGE, setTrack);

    const setSubtitle = this.dispatch((draft, data) => {
      draft.subtitle = data.subtitle;
    });
    this.on(Events.PLAYER_STATE_SUBTITLECHANGE, setSubtitle);

    const setSubtitleText = this.dispatch((draft, data) => {
      draft.subtitleText = data.text;
    });
    this.on(Events.PLAYER_STATE_SUBTITLETEXTCHANGE, setSubtitleText);

    const setPlaybackRate = this.dispatch((draft, data) => {
      draft.playbackRate = data.playbackRate;
    });
    this.on(Events.PLAYER_STATE_RATECHANGE, setPlaybackRate);

    const setPip = this.dispatch((draft, data) => {
      draft.pip = data.pip;
    });
    this.on(Events.PIP_CHANGE, setPip);

    const setAudioLanguages = this.dispatch((draft, data) => {
      draft.audioLanguages = data.audioLanguages;
    });
    this.on(Events.MEDIA_STATE_AUDIOLANGUAGES, setAudioLanguages);

    const setDimensions = this.dispatch((draft, data) => {
      draft.width = data.width;
      draft.height = data.height;
    });
    this.on(Events.DIMENSIONS_CHANGE, setDimensions);

    this.emit(Events.STATE_CHANGE, {
      state: this.state,
      prevState: null,
    } as IStateChangeEventData);
  }

  public getState(): IState {
    return this.state;
  }

  public dispatch = fn => {
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

      const eventQueue = [];
      const push = eventName => eventQueue.push(eventName);

      // Define state events
      if (!prevState.ready && this.state.ready) {
        push(Events.STATE_READY);
      }

      if (!prevState.playRequested && this.state.playRequested) {
        push(Events.STATE_PLAY_REQUESTED);
      }

      if (!prevState.started && this.state.started) {
        push(Events.STATE_STARTED);
      }

      if (!prevState.contentStarted && this.state.contentStarted) {
        push(Events.STATE_CONTENT_STARTED);
      }

      if (!prevState.playing && this.state.playing) {
        push(Events.STATE_PLAYING);
      }

      if (!prevState.paused && this.state.paused) {
        push(Events.STATE_PAUSED);
      }

      if (!prevState.contentEnded && this.state.contentEnded) {
        push(Events.STATE_CONTENT_ENDED);
      }

      if (!prevState.ended && this.state.ended) {
        push(Events.STATE_ENDED);
      }

      if (
        prevState.currentTime !== this.state.currentTime ||
        prevState.adBreakCurrentTime !== this.state.adBreakCurrentTime
      ) {
        push(Events.STATE_CURRENTTIME_CHANGE);
      }

      if (prevState.duration !== this.state.duration) {
        push(Events.STATE_DURATION_CHANGE);
      }

      if (!prevState.buffering && this.state.buffering) {
        push(Events.STATE_BUFFERING);
      }

      if (prevState.adBreaks !== this.state.adBreaks) {
        push(Events.STATE_ADBREAKS);
      }

      if (prevState.adBreak && !this.state.adBreak) {
        push(Events.STATE_ADBREAK_ENDED);
      }

      if (!prevState.adBreak && this.state.adBreak) {
        push(Events.STATE_ADBREAK_STARTED);
      }

      if (prevState.ad && !this.state.ad) {
        push(Events.STATE_AD_ENDED);
      }

      if (!prevState.ad && this.state.ad) {
        push(Events.STATE_AD_STARTED);
      }

      if (prevState.bufferedPercentage !== this.state.bufferedPercentage) {
        push(Events.STATE_BUFFERED_CHANGE);
      }

      if (!prevState.error && this.state.error) {
        push(Events.STATE_ERROR);
      }

      if (prevState.volume !== this.state.volume) {
        push(Events.STATE_VOLUME_CHANGE);
      }

      if (!prevState.fullscreenSupported && this.state.fullscreenSupported) {
        push(Events.STATE_FULLSCREEN_SUPPORTED);
      }

      if (prevState.fullscreen !== this.state.fullscreen) {
        push(Events.STATE_FULLSCREEN_CHANGE);
      }

      if (prevState.tracks !== this.state.tracks) {
        push(Events.STATE_TRACKS);
      }

      if (
        prevState.track !== this.state.track ||
        prevState.trackAutoSwitch !== this.state.trackAutoSwitch
      ) {
        push(Events.STATE_TRACK_CHANGE);
      }

      if (prevState.subtitle !== this.state.subtitle) {
        push(Events.STATE_SUBTITLE_CHANGE);
      }

      if (prevState.subtitleText !== this.state.subtitleText) {
        push(Events.STATE_SUBTITLETEXT_CHANGE);
      }

      if (prevState.playbackRate !== this.state.playbackRate) {
        push(Events.STATE_PLAYBACKRATE_CHANGE);
      }

      if (prevState.pip !== this.state.pip) {
        push(Events.STATE_PIP_CHANGE);
      }

      if (prevState.audioLanguages !== this.state.audioLanguages) {
        push(Events.STATE_AUDIOLANGUAGES);
      }

      if (
        prevState.width !== this.state.width ||
        prevState.height !== this.state.height
      ) {
        push(Events.STATE_DIMENSIONS_CHANGE);
      }

      if (eventQueue.length) {
        const log = this.instance.log('StateExtension');

        eventQueue.forEach(eventName => {
          if (!['state:currenttime-change'].includes(eventName)) {
            log(eventName);
          }

          this.emit(eventName, {
            state: this.state,
            prevState,
          } as IStateChangeEventData);
        });

        this.emit(Events.STATE_CHANGE, {
          state: this.state,
          prevState,
        } as IStateChangeEventData);
      }
    };
  };
}
