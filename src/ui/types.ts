import { PlayerError } from '@src/PlayerError';
import { IThumbnail, ITrack, Subtitle, KeyboardNavigationPurpose } from '@src/types';

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
  timeStatPosition: string;
  timeStatDuration: string;
  error?: PlayerError;
  isCenterClickAllowed: boolean;
  isSeekbarHover: boolean;
  isSeekbarSeeking: boolean;
  seekbarPercentage: number;
  seekbarTooltipText: string;
  seekbarTooltipPercentage: number;
  seekbarThumbnailPercentage: number;
  tracks: ITrack[];
  activeTrack: ITrack;
  selectedTrack: ITrack | string;
  settingsTab: SettingsTabs;
  visibleSettingsTabs: SettingsTabs[];
  subtitles: Subtitle[];
  activeSubtitle: Subtitle;
  playbackRate: number;
  pip: boolean;
  pipSupported: boolean;
  activeThumbnail: IThumbnail;
  isMobile: boolean;
  image: string;
  nodPurpose: KeyboardNavigationPurpose;
  getTranslation(text: string): string;
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
  selectSubtitle(subtitle: Subtitle);
  setPlaybackRate(playbackRate: number);
  togglePip();
  toggleActiveSubtitle();
}

export interface IInfo {
  data: IData;
  actions: IActions;
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
  SUBTITLES,
  PLAYBACKRATES,
}
