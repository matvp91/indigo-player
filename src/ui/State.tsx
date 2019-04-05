import {
  AdBreakType,
  Events,
  IInstance,
  IThumbnail,
  ITrack,
  KeyboardNavigationPurpose,
  Subtitle,
} from '@src/types';
import { getTranslation } from '@src/ui/i18n';
import { triggerEvent } from '@src/ui/triggerEvent';
import {
  IActions,
  IData,
  SettingsTabs,
  ViewTypes,
  IStateStore,
} from '@src/ui/types';
import { attachEvents, EventUnsubscribeFn } from '@src/ui/utils/attachEvents';
import { secondsToHMS } from '@src/ui/utils/secondsToHMS';
import uniqBy from 'lodash/uniqBy';
import React, { RefObject } from 'react';

export const StateContext = React.createContext({});

interface StateStoreProps {
  instance: IInstance;
  player: any;
}

interface StateStoreState {
  visibleControls: boolean;

  // Seekbar
  isSeekbarHover: boolean;
  isSeekbarSeeking: boolean;
  seekbarPercentage: number;

  // Volume
  isVolumeControlsOpen: boolean;
  isVolumebarSeeking: boolean;

  // Settings
  settingsTab: SettingsTabs;

  lastActiveSubtitle: Subtitle;
  activeThumbnail: IThumbnail;

  nodPurpose: KeyboardNavigationPurpose;
}

export const seekbarRef: RefObject<HTMLDivElement> = React.createRef();

export const seekbarTooltipRef: RefObject<HTMLDivElement> = React.createRef();

export const seekbarThumbnailRef: RefObject<HTMLDivElement> = React.createRef();

export class StateStore
  extends React.Component<StateStoreProps, StateStoreState>
  implements IStateStore {
  private activeTimer: number;

  private nodTimer: number;

  private unsubscribe: EventUnsubscribeFn;

  private prevData: IData;

  constructor(props) {
    super(props);

    this.state = {
      visibleControls: false,

      // Seekbar
      isSeekbarHover: false,
      isSeekbarSeeking: false,
      seekbarPercentage: 0,

      // Volume
      isVolumeControlsOpen: false,
      isVolumebarSeeking: false,

      // Settings
      settingsTab: null,

      lastActiveSubtitle: null,
      activeThumbnail: null,

      nodPurpose: null,
    };

    this.unsubscribe = attachEvents([
      {
        element: this.props.instance.container,
        events: ['mouseenter', 'mousemove', 'mousedown'],
        callback: this.showControls,
      },
      {
        element: this.props.instance.container,
        events: ['mouseleave'],
        callback: this.hideControls,
      },
      {
        element: window as any,
        events: ['mousedown'],
        callback: this.closeSettings,
      },
    ]);

    this.props.instance.on(Events.KEYBOARDNAVIGATION_KEYDOWN, data => {
      this.showControls();
      this.triggerNod(data.purpose);

      if (data.purpose === KeyboardNavigationPurpose.REQUEST_TOGGLE_SUBTITLES) {
        this.toggleActiveSubtitle();
      }
      if (
        data.purpose === KeyboardNavigationPurpose.REQUEST_TOGGLE_MINIPLAYER
      ) {
        this.togglePip();
      }
    });
  }

  public componentWillUnmount() {
    this.unsubscribe();
  }

  public componentDidUpdate() {
    const data = this.createData();
    triggerEvent(this.props.instance, data, this.prevData);
    this.prevData = data;
  }

  public render() {
    const data = this.createData();
    const actions = this.createActions();

    return (
      <StateContext.Provider value={{ data, actions }}>
        {this.props.children}
      </StateContext.Provider>
    );
  }

  public showControls = () => {
    clearTimeout(this.activeTimer);

    this.setState({ visibleControls: true });

    this.activeTimer = (window as any).setTimeout(() => {
      this.setState({ visibleControls: false });
    }, 2000);
  };

  private hideControls = () => {
    clearTimeout(this.activeTimer);
    this.setState({ visibleControls: false });
  };

  private triggerNod = (purpose: KeyboardNavigationPurpose) => {
    this.setState({ nodPurpose: null }, () => {
      if (this.nodTimer) {
        clearTimeout(this.nodTimer);
        this.nodTimer = null;
      }
      this.setState({ nodPurpose: purpose }, () => {
        this.nodTimer = (window as any).setTimeout(() => {
          this.setState({ nodPurpose: null });
          this.nodTimer = null;
        }, 500);
      });
    });
  };

  private setVolumeControlsOpen = (isVolumeControlsOpen: boolean) => {
    if (!this.props.instance.env.isMobile) {
      this.setState({ isVolumeControlsOpen });
    }
  };

  private setSeekbarState = (state, prevState) => {
    let activeThumbnail = null;
    const thumbnailsExtension: any = this.props.instance.getModule(
      'ThumbnailsExtension',
    );
    if ((state.hover || state.seeking) && thumbnailsExtension) {
      activeThumbnail = thumbnailsExtension.getThumbnail(
        state.percentage * this.props.player.duration,
      );
    }

    this.setState({
      isSeekbarHover: state.hover,
      isSeekbarSeeking: state.seeking,
      seekbarPercentage: state.percentage,
      activeThumbnail,
    });

    if (!state.seeking && prevState.seeking) {
      this.showControls();
      this.props.instance.seekTo(this.props.player.duration * state.percentage);
    }
  };

  private setVolumebarState = (state, prevState) => {
    this.setState({
      isVolumebarSeeking: state.seeking,
    });

    if (!state.seeking && prevState.seeking) {
      this.showControls();
    }

    if (state.seeking) {
      const volume = state.percentage;
      this.props.instance.setVolume(volume);
    }
  };

  private toggleMute = () => {
    if (this.props.player.volume) {
      this.props.instance.setVolume(0);
    } else {
      this.props.instance.setVolume(1);
    }
  };

  private playOrPause = (origin?: string) => {
    if (!this.props.player.playRequested) {
      this.props.instance.play();
      if (origin === 'center') {
        this.triggerNod(KeyboardNavigationPurpose.PLAY);
      }
    } else {
      this.props.instance.pause();
      if (origin === 'center') {
        this.triggerNod(KeyboardNavigationPurpose.PAUSE);
      }
    }
  };

  private toggleFullscreen = () => {
    (this.props.instance.getModule(
      'FullscreenExtension',
    ) as any).toggleFullscreen();
  };

  private selectTrack = (track: ITrack) => {
    this.props.instance.selectTrack(track);
  };

  private setPlaybackRate = (playbackRate: number) => {
    this.props.instance.setPlaybackRate(playbackRate);
  };

  private closeSettings = (event: MouseEvent) => {
    const isOver = (className: string) => {
      const target: EventTarget = event.target;
      const container = this.props.instance.container.querySelector(className);
      return (
        container &&
        (container === target || container.contains(target as Node))
      );
    };

    if (isOver('.igui_settings') || isOver('.igui_button_name-settings')) {
      return;
    }

    this.setState({ settingsTab: SettingsTabs.NONE });
  };

  private toggleSettings = () => {
    this.setState(prevState => ({
      settingsTab: prevState.settingsTab
        ? SettingsTabs.NONE
        : SettingsTabs.OPTIONS,
    }));
  };

  private setSettingsTab = (settingsTab: SettingsTabs) => {
    this.setState({ settingsTab });
  };

  private selectSubtitle = (subtitle: Subtitle) => {
    if (subtitle) {
      this.setState({ lastActiveSubtitle: subtitle });
    }

    (this.props.instance.getModule('SubtitlesExtension') as any).setSubtitle(
      subtitle ? subtitle.srclang : null,
    );
  };

  private toggleActiveSubtitle = () => {
    let subtitle: Subtitle = this.state.lastActiveSubtitle;
    if (!subtitle) {
      subtitle = this.props.instance.config.subtitles[0];
    }

    this.selectSubtitle(this.props.player.subtitle ? null : subtitle);
  };

  private togglePip = () => {
    (this.props.instance.getModule('PipExtension') as any).togglePip();
  };

  private getTranslation = (text: string): string => {
    return getTranslation(this.props.instance.config.ui.locale)(text);
  };

  /**
   * Create a state snapshot for the player.
   * @return {IData} The snapshot data
   */
  private createData(): IData {
    // Figure out which view to show.
    let view = ViewTypes.LOADING;
    if (this.props.player.ready && this.props.player.waitingForUser) {
      view = ViewTypes.START;
    }
    if (this.props.player.videoSessionStarted) {
      view = ViewTypes.CONTROLS;
    }
    if (this.props.player.playRequested && !this.props.player.started) {
      view = ViewTypes.LOADING;
    }
    if (this.props.player.error) {
      view = ViewTypes.ERROR;
    }

    // Do we need to show the controls?
    let visibleControls = this.state.visibleControls;
    if (
      this.state.isSeekbarSeeking ||
      this.state.isVolumebarSeeking ||
      !!this.state.settingsTab ||
      this.props.instance.config.ui.lockControlsVisibility
    ) {
      // If we're seeking, either by video position or volume, keep the controls visible.
      visibleControls = true;
    }

    // Do we need to open the volume bar?
    let isVolumeControlsOpen = this.state.isVolumeControlsOpen;
    if (this.state.isVolumebarSeeking) {
      // If we're seeking volume, keep the volume bar open.
      isVolumeControlsOpen = true;
    }

    // Create a data object for the currently playing ad.
    let adBreakData;
    if (this.props.player.adBreak) {
      adBreakData = {
        progressPercentage:
          this.props.player.adBreakCurrentTime /
          this.props.player.adBreak.duration,
      };
    }

    // Calculate the current progress percentage.
    // TODO: Do not calculate progressPercentage if controls are not visible for x-ms (animation time)
    //       and with smooth seeking on.
    let progressPercentage = 0;
    if (this.props.player.duration) {
      progressPercentage =
        this.props.player.currentTime / this.props.player.duration;
    }
    if (this.state.isSeekbarSeeking) {
      // If we're seeking with the seekbar, no longer show the current video progress
      // but use the seekbar percentage.
      progressPercentage = this.state.seekbarPercentage;
    }
    if (adBreakData) {
      // If we're playing an ad, the progress bar displays the progress of the adbreak.
      progressPercentage = adBreakData.progressPercentage;
    }

    // Create a percentages list of the cuepoints.
    let cuePoints = [];
    if (this.props.player.duration && this.props.player.adBreaks.length) {
      cuePoints = this.props.player.adBreaks
        .filter(
          adBreak =>
            adBreak.type === AdBreakType.MIDROLL && !adBreak.hasBeenWatched,
        )
        .map(adBreak => adBreak.startsAt / this.props.player.duration);
    }

    // Create a proper time stat ((HH)/MM/SS).
    let timeStatDuration = '';
    if (this.props.player.duration) {
      timeStatDuration = secondsToHMS(this.props.player.duration);
    }
    const timeStatPosition = secondsToHMS(this.props.player.currentTime);

    // Pass an error if we have one.
    let error;
    if (this.props.player.error) {
      error = this.props.player.error;
    }

    // Allowing a center click will result in a play or a pause.
    let isCenterClickAllowed = true;
    if (adBreakData || this.props.instance.env.isMobile) {
      // If you click an ad, we don't want to pause but perform an ad clickthrough.
      // Also, on mobile this doesn't make sense because we'll use a tap to show the UI instead.
      isCenterClickAllowed = false;
    }

    // The seekbar tooltip is the current time ((HH)/MM/SS).
    let seekbarTooltipText;
    if (this.props.player.duration) {
      seekbarTooltipText = secondsToHMS(
        this.state.seekbarPercentage * this.props.player.duration,
      );
    }

    // Calculate the seekbar tooltip percentage for placement.
    let seekbarTooltipPercentage = this.state.seekbarPercentage;
    if (seekbarRef.current && seekbarTooltipRef.current) {
      // The tooltip is placed in the center, we don't want it to go out of bounds.
      // Calculate and adjust the correct placement so it'll stick on the sides (eg, moving mouse to 00:00).
      const seekbarWidth = (seekbarRef.current as HTMLElement).getBoundingClientRect()
        .width;
      const tooltipWidth = (seekbarTooltipRef.current as HTMLElement).getBoundingClientRect()
        .width;
      const offset = tooltipWidth / 2 / seekbarWidth;
      if (seekbarTooltipPercentage < offset) {
        seekbarTooltipPercentage = offset;
      } else if (seekbarTooltipPercentage > 1 - offset) {
        seekbarTooltipPercentage = 1 - offset;
      }
    }

    // Calculate the seekbar thumbnail percentage for placement.
    let seekbarThumbnailPercentage = this.state.seekbarPercentage;
    if (seekbarRef.current && seekbarThumbnailRef.current) {
      // The tooltip is placed in the center, we don't want it to go out of bounds.
      // Calculate and adjust the correct placement so it'll stick on the sides (eg, moving mouse to 00:00).
      const seekbarWidth = (seekbarRef.current as HTMLElement).getBoundingClientRect()
        .width;
      const thumbnailWidth = (seekbarThumbnailRef.current as HTMLElement).getBoundingClientRect()
        .width;
      const offset = thumbnailWidth / 2 / seekbarWidth;
      if (seekbarThumbnailPercentage < offset) {
        seekbarThumbnailPercentage = offset;
      } else if (seekbarThumbnailPercentage > 1 - offset) {
        seekbarThumbnailPercentage = 1 - offset;
      }
    }

    const tracks = uniqBy<ITrack>(
      this.props.player.tracks.sort(
        (a, b) => Number(b.height) - Number(a.height),
      ),
      'height',
    );

    let activeTrack = null;
    if (this.props.player.track) {
      activeTrack = tracks.find(
        track => track.id === this.props.player.track.id,
      );
    }

    let selectedTrack = activeTrack;
    if (this.props.player.trackAutoSwitch) {
      selectedTrack = 'auto';
    }

    const subtitles = this.props.instance.config.subtitles || [];

    const activeSubtitle = this.props.player.subtitle;

    const visibleSettingsTabs = [SettingsTabs.PLAYBACKRATES];
    if (subtitles.length) {
      visibleSettingsTabs.push(SettingsTabs.SUBTITLES);
    }
    if (tracks.length) {
      visibleSettingsTabs.push(SettingsTabs.TRACKS);
    }

    let pipSupported = false;
    if (this.props.instance.config.ui.pip) {
      pipSupported = true;
    }

    const nodIcon = {
      [KeyboardNavigationPurpose.PLAY]: 'play',
      [KeyboardNavigationPurpose.PAUSE]: 'pause',
      [KeyboardNavigationPurpose.VOLUME_UP]: 'volume-2',
      [KeyboardNavigationPurpose.VOLUME_DOWN]: 'volume-1',
      [KeyboardNavigationPurpose.VOLUME_MUTED]: 'volume-off',
      [KeyboardNavigationPurpose.VOLUME_UNMUTED]: 'volume-2',
      [KeyboardNavigationPurpose.REQUEST_TOGGLE_SUBTITLES]: 'cc',
    }[this.state.nodPurpose];

    return {
      // UI specific state
      view,
      visibleControls,
      isCenterClickAllowed,
      settingsTab: this.state.settingsTab,
      visibleSettingsTabs,
      isMobile: this.props.instance.env.isMobile,
      image: this.props.instance.config.ui.image,
      nodIcon,

      // Player
      playRequested: this.props.player.playRequested,
      paused: this.props.player.paused,
      rebuffering: this.props.player.buffering,
      tracks,
      activeTrack,
      selectedTrack,
      error,
      cuePoints,
      timeStatPosition,
      timeStatDuration,
      playbackRate: this.props.player.playbackRate,
      pip: this.props.player.pip,
      pipSupported,

      // Progress bar
      progressPercentage,
      bufferedPercentage: this.props.player.bufferedPercentage,
      isSeekbarHover: this.state.isSeekbarHover,
      isSeekbarSeeking: this.state.isSeekbarSeeking,
      seekbarPercentage: this.state.seekbarPercentage,
      seekbarTooltipText,
      seekbarTooltipPercentage,
      seekbarThumbnailPercentage,

      // Fullscreen
      fullscreenSupported: this.props.player.fullscreenSupported,
      isFullscreen: this.props.player.fullscreen,

      // Ads
      adBreakData,

      // Volume button & volume bar
      isVolumeControlsOpen,
      volumeBarPercentage: this.props.player.volume,

      // Subtitles
      subtitles,
      activeSubtitle,
      activeThumbnail: this.state.activeThumbnail,

      // i18n
      getTranslation: this.getTranslation,
    } as IData;
  }

  /**
   * Create actions for the UI to interact with.
   * @return {IActions} The actions
   */
  private createActions(): IActions {
    return {
      playOrPause: this.playOrPause,
      toggleFullscreen: this.toggleFullscreen,
      setVolumeControlsOpen: this.setVolumeControlsOpen,
      toggleMute: this.toggleMute,
      setSeekbarState: this.setSeekbarState,
      setVolumebarState: this.setVolumebarState,
      selectTrack: this.selectTrack,
      setSettingsTab: this.setSettingsTab,
      toggleSettings: this.toggleSettings,
      selectSubtitle: this.selectSubtitle,
      toggleActiveSubtitle: this.toggleActiveSubtitle,
      setPlaybackRate: this.setPlaybackRate,
      togglePip: this.togglePip,
    } as IActions;
  }
}
