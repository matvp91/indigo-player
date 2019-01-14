import * as React from 'react';
import { Instance } from '@src/Instance';
import { ViewTypes } from '@src/ui/types';

export const StateContext = React.createContext({});

interface StateStoreProps {
  instance: Instance;
  player: any;
}

interface StateStoreState {
  visibleControls: boolean;
}

export class StateStore extends React.Component<StateStoreProps, StateStoreState> {
  activeTimer: number;

  constructor(props) {
    super(props);

    this.state = {
      visibleControls: false,
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

  createData() {
    let view = ViewTypes.LOADING;
    if (this.props.player.ready && this.props.player.waitingForUser) {
      view = ViewTypes.START;
    }
    if (this.props.player.videoSessionStarted) {
      view = ViewTypes.CONTROLS;
    }

    return {
      view,
      paused: this.props.player.paused,
      visibleControls: this.state.visibleControls,
    };
  }

  createActions() {
    return {
      play: () => this.props.instance.play(),
      pause: () => this.props.instance.pause(),
      showControls: this.showControls,
      hideControls: this.hideControls,
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
