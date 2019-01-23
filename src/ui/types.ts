import { PlayerError } from '@src/PlayerError';

export interface IData {
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

  isSeekbarHover: boolean;
  isSeekbarSeeking: boolean;
  seekbarPercentage: number;
  seekbarTooltipText: string;
  seekbarTooltipPercentage: number;
}

export interface IActions {
  playOrPause();
  startSeeking();
  seekToPercentage(percentage: number);
  setVolume(volume: number);
  setVolumeControlsOpen(isVolumeControlsOpen: boolean);
  startVolumebarSeeking();
  stopVolumebarSeeking();
  toggleMute();
  toggleFullscreen();
  togglePip();
  setSeekbarState(state: any);
  setVolumebarState(state: any);
}

export enum ViewTypes {
  ERROR,
  LOADING,
  START,
  CONTROLS,
}
