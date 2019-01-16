export interface IData {
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
  LOADING,
  START,
  CONTROLS,
}