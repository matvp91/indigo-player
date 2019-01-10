import { Instance } from '@src/Instance';
import { Module } from '@src/Module';
import { Events, StateChangeEventData } from '@src/types';
import produce from 'immer';

interface State {
  ready: boolean;
  videoSessionStarted: boolean;
  waitingForUser: boolean;

  playRequested: boolean;
  playing: boolean;
  paused: boolean;
  buffering: boolean;

  currentTime: number;
  duration: number;

  adBreaks: any;
  adBreak: any;
  adBreakCurrentTime: number;
}

export class StateExtension extends Module {
  private state: State = {
    ready: false,
    videoSessionStarted: false,
    waitingForUser: false,

    playRequested: false,
    playing: false,
    paused: false,
    buffering: false,

    currentTime: null,
    duration: null,

    adBreaks: [],
    adBreak: null,
    adBreakCurrentTime: null,
  };

  constructor(instance: Instance) {
    super(instance);

    const setReady = this.dispatch((draft, data) => {
      draft.ready = true;
      draft.duration = data.duration;
      draft.waitingForUser = !instance.canAutoplay();
    });
    this.on(Events.PLAYER_STATE_READY, setReady);

    const setPlayRequested = this.dispatch(draft => {
      draft.waitingForUser = false;
      draft.playRequested = true;
      draft.paused = false;
      draft.videoSessionStarted = true;
    });
    this.on(Events.PLAYER_STATE_PLAY, setPlayRequested);
    this.on(Events.ADBREAK_STATE_PLAY, setPlayRequested);

    const setPlaying = this.dispatch(draft => {
      draft.playing = true;
      draft.buffering = false;
      draft.paused = false;
    });
    this.on(Events.PLAYER_STATE_PLAYING, setPlaying);
    this.on(Events.ADBREAK_STATE_PLAYING, setPlaying);

    const setPaused = this.dispatch(draft => {
      draft.playRequested = false;
      draft.playing = false;
      draft.paused = true;
    });
    this.on(Events.PLAYER_STATE_PAUSE, setPaused);
    this.on(Events.ADBREAK_STATE_PAUSE, setPaused);

    const setCurrentTime = this.dispatch((draft, data) => {
      draft.currentTime = data.currentTime;
    });
    this.on(Events.PLAYER_STATE_TIMEUPDATE, setCurrentTime);

    const setAdBreakCurrentTime = this.dispatch((draft, data) => {
      draft.adBreakCurrentTime = data.currentTime;
    });
    this.on(Events.ADBREAK_STATE_TIMEUPDATE, setAdBreakCurrentTime);

    const setBuffering = this.dispatch(draft => {
      draft.playing = false;
      draft.buffering = true;
    });
    this.on(Events.PLAYER_STATE_WAITING, setBuffering);

    const setAdBreaks = this.dispatch((draft, data) => {
      draft.adBreaks = data.adBreaks;
    });
    this.on(Events.ADBREAKS, setAdBreaks);

    const setAdBreak = this.dispatch((draft, data) => {
      draft.adBreak = data.adBreak;
    });

    this.on(Events.ADBREAK_STARTED, setAdBreak);

    const resetAdBreak = this.dispatch(draft => {
      draft.adBreak = null;
      draft.adBreakCurrentTime = null;
    });
    this.on(Events.ADBREAK_ENDED, resetAdBreak);

    this.emit(Events.STATE_CHANGE, {
      state: this.state,
      prevState: null,
    } as StateChangeEventData);
  }

  public dispatch = fn => {
    return data => {
      const newState = produce(this.state, draft => {
        fn(draft, data);
        return draft;
      });

      if (newState === this.state) {
        return;
      }

      const prevState = this.state;
      this.state = newState;

      this.emit(Events.STATE_CHANGE, {
        state: this.state,
        prevState,
      } as StateChangeEventData);
    };
  };
}
