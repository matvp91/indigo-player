import { Button } from '@src/ui/components/Button';
import { ControlsView } from '@src/ui/components/ControlsView';
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
  componentDidMount() {
    ['mouseenter', 'mousemove', 'mousedown'].forEach(eventName => {
      this.props.data.container.addEventListener(eventName, this.props.actions.showControls);
    });
    this.props.data.container.addEventListener('mouseleave', this.props.actions.hideControls);
  }

  render() {
    const props = this.props;
    return (
      <div className={cx({
        'igui_state-active': this.props.data.visibleControls,
      })}>
        {this.props.data.view === ViewTypes.LOADING && <LoadingView />}
        {this.props.data.view === ViewTypes.START && <StartView />}
        {this.props.data.view === ViewTypes.CONTROLS && <ControlsView />}
      </div>
    );
  }
}

export const Main = withState(MainComponent);
