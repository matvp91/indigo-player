import * as React from 'react';
import { Instance } from '@src/Instance';
import { ViewTypes, SeekbarTypes } from '@src/ui/types';

export const StateContext = React.createContext({});

interface StateStoreProps {
  instance: Instance;
  player: any;
}

interface StateStoreState {
  visibleControls: boolean;
  isSeekbarActive: boolean;
  isSeeking: boolean;
  seekBarLeftOffset: number;
  seekBarWidth: number;
  seekBarPercentage: number;
  isVolumeControlsOpen: boolean;
  isVolumeSeeking: boolean;
}

export class StateStore extends React.Component<StateStoreProps, StateStoreState> {
  activeTimer: number;

  constructor(props) {
    super(props);

    this.state = {
      visibleControls: false,
      isSeeking: false,
      seekBarLeftOffset: null,
      seekBarWidth: null,
      seekBarPercentage: null,
      isSeekbarActive: false,
      isVolumeControlsOpen: false,
      isVolumeSeeking: false,
    };

    (window as any).addEventListener('mousemove', this.onWindowMouseMove);
    (window as any).addEventListener('mouseup', this.onWindowMouseUp);
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

  setSliderActive = (type: SeekbarTypes) => (event) => {
    event.preventDefault();

    const bounding = event.currentTarget.getBoundingClientRect();
    const pageX = event.pageX;

    const newState = {
      seekBarLeftOffset: bounding.left,
      seekBarWidth: bounding.width,
    } as any;

    if (type === SeekbarTypes.PROGRESS) {
      newState.isSeekbarActive = true;
    }

    this.setState(newState, () => {
      this.onWindowMouseMove({ pageX });
    });
  }

  setSliderInactive = (type: SeekbarTypes) => () => {
    if (type === SeekbarTypes.PROGRESS) {
      this.setState({ isSeekbarActive: false });
    }
  }

  setSliderSeeking = (type: SeekbarTypes) => () => {
    if (type === SeekbarTypes.PROGRESS) {
      this.setState({ isSeeking: true });
    }
    if (type === SeekbarTypes.VOLUME) {
      this.setState({ isVolumeSeeking: true });
    }
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

  onWindowMouseMove = (event) => {
    const shouldMeasure =
      this.state.isSeekbarActive ||
      this.state.isSeeking ||
      this.state.isVolumeSeeking;

    if (shouldMeasure) {
      if (event.preventDefault) {
        event.preventDefault();
      }

      const scrollX = window.scrollX || window.pageXOffset;
      let percent = (event.pageX - (this.state.seekBarLeftOffset + scrollX)) / this.state.seekBarWidth;

      percent = Math.min(Math.max(percent, 0), 1);

      if (this.state.isSeekbarActive || this.state.isSeeking) {
        this.setState({ seekBarPercentage: percent });
      } else if (this.state.isVolumeSeeking) {
        this.props.instance.setVolume(percent);
      }
    }
  };

  onWindowMouseUp = (event) => {
    // A click without a mousemove should also register the desired seek percentages.
    this.onWindowMouseMove({ pageX: event.pageX });

    if (this.state.isSeeking) {
      this.props.instance.seekTo(this.props.player.duration * this.state.seekBarPercentage);
      this.setState({ isSeeking: false });

      this.showControls();
    }

    if (this.state.isVolumeSeeking) {
      this.setState({ isVolumeSeeking: false });
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

    let visibleControls = this.state.visibleControls;
    if (this.state.isSeeking) {
      visibleControls = true;
    }

    let progressPercentage = this.props.player.currentTime / this.props.player.duration;
    if (this.state.isSeeking) {
      progressPercentage = this.state.seekBarPercentage;
    }
    if (!this.props.player.duration) {
      progressPercentage = 0;
    }

    let isVolumeControlsOpen = this.state.isVolumeControlsOpen;
    if (this.state.isVolumeSeeking) {
      isVolumeControlsOpen = true;
    }

    return {
      view,
      paused: this.props.player.paused,
      visibleControls,
      seekBarPercentage: this.state.seekBarPercentage,
      isSeekbarActive: this.state.isSeekbarActive,
      isSeeking: this.state.isSeeking,
      progressPercentage,
      bufferedPercentage: this.props.player.bufferedPercentage,
      volumeBarPercentage: this.props.player.volume,
      isVolumeControlsOpen,
    };
  }

  createActions() {
    return {
      play: () => this.props.instance.play(),
      pause: () => this.props.instance.pause(),
      showControls: this.showControls,
      hideControls: this.hideControls,
      setSliderSeeking: this.setSliderSeeking,
      setSliderActive: this.setSliderActive,
      setSliderInactive: this.setSliderInactive,
      setVolumeControlsOpen: this.setVolumeControlsOpen,
      setVolumeControlsClosed: this.setVolumeControlsClosed,
      toggleMute: this.toggleMute,
    };
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
