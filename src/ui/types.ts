import { PlayerError } from '@src/PlayerError';
import { ITrack, Caption } from '@src/types';

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
  tracks: ITrack[],
  activeTrack: ITrack,
  selectedTrack: ITrack | string,
  settingsTab: SettingsTabs,
  captions: Caption[],
  activeCaption: Caption,
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
  setSeekbarState(state: any);
  setVolumebarState(state: any);
  selectTrack(track: ITrack);
  setSettingsTab(tab: SettingsTabs);
  toggleSettings();
  selectCaption(caption: Caption);
}

export enum ViewTypes {
  ERROR,
  LOADING,
  START,
  CONTROLS,
}

export enum SettingsTabs {
  NONE,
  OPTIONS,
  TRACKS,
  CAPTIONS,
}
