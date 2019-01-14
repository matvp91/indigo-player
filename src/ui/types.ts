export interface IData {
  paused: boolean;
  view: ViewTypes;
  visibleControls: boolean;
}

export interface IActions {
  play();
  pause();
  showControls();
  hideControls();
}

export enum ViewTypes {
  LOADING,
  START,
  CONTROLS,
}
