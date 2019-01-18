import { Button } from '@src/ui/components/Button';
import { ControlsView } from '@src/ui/components/ControlsView';
import { ErrorView } from '@src/ui/components/ErrorView';
import { LoadingView } from '@src/ui/components/LoadingView';
import { StartView } from '@src/ui/components/StartView';
import { IActions, IData, ViewTypes } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import cx from 'classnames';
import * as React from 'react';

interface MainProps {
  data: IData;
  actions: IActions;
}

class MainComponent extends React.Component<MainProps, {}> {
  public componentDidMount() {

    this.props.data.container.addEventListener(
      'mouseenter',
      this.props.actions.showControls,
    );
    this.props.data.container.addEventListener(
      'mousemove',
      this.props.actions.showControls,
    );
    this.props.data.container.addEventListener(
      'mousedown',
      this.props.actions.showControls,
    );
    this.props.data.container.addEventListener(
      'mouseleave',
      this.props.actions.hideControls,
    );
    document.addEventListener('keyup', this.onHandleProbablyKeyboardNav, false);
    document.addEventListener('mousedown', this.onHandleProbablyKeyboardNav, false);
  }

  componentWillUnmount() {
    this.props.data.container.removeEventListener(
      'mouseenter',
      this.props.actions.showControls,
    );
    this.props.data.container.removeEventListener(
      'mousemove',
      this.props.actions.showControls,
    );
    this.props.data.container.removeEventListener(
      'mousedown',
      this.props.actions.showControls,
    );
    this.props.data.container.removeEventListener(
      'mouseleave',
      this.props.actions.hideControls,
    );
    document.removeEventListener('keyup', this.onHandleProbablyKeyboardNav, false);
    document.removeEventListener('mousedown', this.onHandleProbablyKeyboardNav, false);
  }

  private onHandleProbablyKeyboardNav = (event: KeyboardEvent) => {
   const code:number = event.keyCode || event.which;
   this.props.actions.setProbablyKeyboardNav(code === 9);
  };

  public render() {
    const props = this.props;
    return (
      <div
        className={cx({
          'igui_state-active': this.props.data.visibleControls,
          'igui_state-volumecontrols-open': this.props.data
            .isVolumeControlsOpen,
          'igui_state-isprobablykeyboardnav': this.props.data.isProbablyKeyboardNav,
        })}
      >
        {this.props.data.view === ViewTypes.ERROR && <ErrorView />}
        {this.props.data.view === ViewTypes.LOADING && <LoadingView />}
        {this.props.data.view === ViewTypes.START && <StartView />}
        {this.props.data.view === ViewTypes.CONTROLS && <ControlsView />}
      </div>
    );
  }
}

export const Main = withState(MainComponent);
