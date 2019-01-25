import { AdBreakType, IInstance } from '@src/types';
import { IActions, IData, ViewTypes } from '@src/ui/types';
import { attachEvents, EventUnsubscribeFn } from '@src/ui/utils/attachEvents';
import { secondsToHMS } from '@src/ui/utils/secondsToHMS';
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
}

export const seekbarRef: RefObject<HTMLDivElement> = React.createRef();

export const seekbarTooltipRef: RefObject<HTMLDivElement> = React.createRef();

export class StateStore extends React.Component<
  StateStoreProps,
  StateStoreState
> {
  private activeTimer: number;

  private unsubscribe: EventUnsubscribeFn;

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
    ]);
  }

  public componentWillUnmount() {
    this.unsubscribe();
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

  private showControls = () => {
    clearTimeout(this.activeTimer);

    this.setState({ visibleControls: true });

    this.activeTimer = setTimeout(() => {
      this.setState({ visibleControls: false });
    }, 2000);
  };

  private hideControls = () => {
    clearTimeout(this.activeTimer);
    this.setState({ visibleControls: false });
  };

  private setVolumeControlsOpen = (isVolumeControlsOpen: boolean) => {
    if (!this.props.instance.env.isMobile) {
      this.setState({ isVolumeControlsOpen });
    }
  };

  private setSeekbarState = (state, prevState) => {
    this.setState({
      isSeekbarHover: state.hover,
      isSeekbarSeeking: state.seeking,
      seekbarPercentage: state.percentage,
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

  private playOrPause = () => {
    if (!this.props.player.playRequested) {
      this.props.instance.play();
    } else {
      this.props.instance.pause();
    }
  };

  private toggleFullscreen = () => {
    (this.props.instance.getModule(
      'FullscreenExtension',
    ) as any).toggleFullscreen();
  };

  private togglePip = () => {
    (this.props.instance.getModule('PipExtension') as any).togglePip();
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
    if (this.state.isSeekbarSeeking || this.state.isVolumebarSeeking) {
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
    let timeStat = '';
    if (this.props.player.duration) {
      timeStat = `${secondsToHMS(
        this.props.player.currentTime,
      )} / ${secondsToHMS(this.props.player.duration)}`;
    }

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

    // Figure out if PIP is supported.
    let pipSupported = false;
    if (
      this.props.instance.config.uiOptions &&
      this.props.instance.config.uiOptions.enablePip
    ) {
      pipSupported = true;
    }

    return {
      // UI specific state
      view,
      visibleControls,
      isCenterClickAllowed,

      // Player
      playRequested: this.props.player.playRequested,
      paused: this.props.player.paused,
      rebuffering: this.props.player.buffering,
      error,
      cuePoints,
      timeStat,

      // Progress bar
      progressPercentage,
      bufferedPercentage: this.props.player.bufferedPercentage,
      isSeekbarHover: this.state.isSeekbarHover,
      isSeekbarSeeking: this.state.isSeekbarSeeking,
      seekbarPercentage: this.state.seekbarPercentage,
      seekbarTooltipText,
      seekbarTooltipPercentage,

      // Fullscreen
      fullscreenSupported: this.props.player.fullscreenSupported,
      isFullscreen: this.props.player.fullscreen,

      // PIP
      isPip: this.props.player.pip,
      pipSupported,

      // Ads
      adBreakData,

      // Volume button & volume bar
      isVolumeControlsOpen,
      volumeBarPercentage: this.props.player.volume,
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
      togglePip: this.togglePip,
      setSeekbarState: this.setSeekbarState,
      setVolumebarState: this.setVolumebarState,
    } as IActions;
  }
}
