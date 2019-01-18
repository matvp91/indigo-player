import { PlayerError } from '@src/PlayerError';

export interface IData {
  container: HTMLElement;
  paused: boolean;
  view: ViewTypes;
  visibleControls: boolean;
  progressPercentage: number;
  bufferedPercentage: number;
  volumeBarPercentage: number;
  isVolumeControlsOpen: boolean;
  isFullscreen: boolean;
  isPip: boolean;
  pipSupported: boolean;
  fullscreenSupported: boolean;
  playRequested: boolean;
  adBreakData?: {
    progressPercentage: number;
  };
  cuePoints: number[];
  rebuffering: boolean;
  timeStat: string;
  error?: PlayerError;
  isCenterClickAllowed: boolean;
}

export interface IActions {
  playOrPause();
  startSeeking();
  seekToPercentage(percentage: number);
  setVolume(volume: number);
  showControls();
  hideControls();
  setVolumeControlsOpen();
  setVolumeControlsClosed();
  startVolumebarSeeking();
  stopVolumebarSeeking();
  toggleMute();
  toggleFullscreen();
  togglePip();
}

export enum ViewTypes {
  ERROR,
  LOADING,
  START,
  CONTROLS,
}
