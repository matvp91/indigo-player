import * as React from 'react';
import { Instance } from '@src/Instance';
import { ViewTypes, IData, IActions } from '@src/ui/types';
import { AdBreakType } from '@src/types';

export const StateContext = React.createContext({});

interface StateStoreProps {
  instance: Instance;
  player: any;
}

interface StateStoreState {
  visibleControls: boolean;
  isVolumeControlsOpen: boolean;
}

export class StateStore extends React.Component<StateStoreProps, StateStoreState> {
  activeTimer: number;

  constructor(props) {
    super(props);

    this.state = {
      visibleControls: false,
      isVolumeControlsOpen: false,
    };
  }

  showControls = () => {
    clearTimeout(this.activeTimer);

    this.setState({ visibleControls: true });

    this.activeTimer = setTimeout(() => {
      this.setState({ visibleControls: false });
    }, 2000);
  };

  hideControls = () => {
    clearTimeout(this.activeTimer);
    this.setState({ visibleControls: false });
  };

  setVolumeControlsOpen = () => {
    this.setState({ isVolumeControlsOpen: true });
  };

  setVolumeControlsClosed = () => {
    this.setState({ isVolumeControlsOpen: false });
  };

  toggleMute = () => {
     if (this.props.player.volume) {
       this.props.instance.setVolume(0);
     } else {
       this.props.instance.setVolume(1);
     }
  };

  playOrPause = () => {
    if (!this.props.player.playRequested) {
      this.props.instance.play();
    } else {
      this.props.instance.pause();
    }
  };

  createData() {
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

    let visibleControls = this.state.visibleControls;

    let progressPercentage = this.props.player.currentTime / this.props.player.duration;
    if (!this.props.player.duration) {
      progressPercentage = 0;
    }

    const isVolumeControlsOpen = this.state.isVolumeControlsOpen;

    let adBreakData;
    if (this.props.player.adBreak) {
      adBreakData = {
        progressPercentage: this.props.player.adBreakCurrentTime / this.props.player.adBreak.duration,
      };
    }

    let cuePoints = [];
    if (this.props.player.duration) {
      cuePoints = this.props.player.adBreaks
        .filter(adBreak => adBreak.type === AdBreakType.MIDROLL && !adBreak.hasBeenWatched)
        .map(adBreak => adBreak.startsAt / this.props.player.duration);
    }

    return {
      view,
      paused: this.props.player.paused,
      visibleControls,
      progressPercentage,
      bufferedPercentage: this.props.player.bufferedPercentage,
      volumeBarPercentage: this.props.player.volume,
      isVolumeControlsOpen,
      fullscreenSupported: this.props.player.fullscreenSupported,
      isFullscreen: this.props.player.fullscreen,
      playRequested: this.props.player.playRequested,
      adBreakData,
      cuePoints,
    } as IData;
  }

  createActions() {
    return {
      playOrPause: this.playOrPause,
      seekToPercentage: (percentage: number) => this.props.instance.seekTo(this.props.player.duration * percentage),
      setVolume: (volume: number) => this.props.instance.setVolume(volume),
      toggleFullscreen: () => (this.props.instance.getModule('FullscreenExtension') as any).toggleFullscreen(),
      showControls: this.showControls,
      hideControls: this.hideControls,
      setVolumeControlsOpen: this.setVolumeControlsOpen,
      setVolumeControlsClosed: this.setVolumeControlsClosed,
      toggleMute: this.toggleMute,
    } as IActions;
  }

  render() {
    const data = this.createData();
    const actions = this.createActions();

    return (
      <StateContext.Provider value={{ data, actions }}>
        {this.props.children}
      </StateContext.Provider>
    );
  }
}
