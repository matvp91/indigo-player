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
  fullscreenSupported: boolean;
  playRequested: boolean;
  adBreakData?: {
    progressPercentage: number;
  };
  cuePoints: number[];
  rebuffering: boolean;
  timeStat: string;
  error?: PlayerError;
}

export interface IActions {
  playOrPause();
  seekToPercentage(percentage: number);
  setVolume(volume: number);
  showControls();
  hideControls();
  setVolumeControlsOpen();
  setVolumeControlsClosed();
  toggleMute();
  toggleFullscreen();
}

export enum ViewTypes {
  ERROR,
  LOADING,
  START,
  CONTROLS,
}
