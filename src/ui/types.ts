export interface IData {
  paused: boolean;
  view: ViewTypes;
  visibleControls: boolean;
  progressPercentage: number;
  bufferedPercentage: number;
  volumeBarPercentage: number;
  isVolumeControlsOpen: boolean;
}

export interface IActions {
  play();
  pause();
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