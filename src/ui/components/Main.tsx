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

export const Main = withState((props: MainProps) => (
  <div
    onMouseEnter={props.actions.showControls}
    onMouseMove={props.actions.showControls}
    onMouseLeave={props.actions.hideControls}
    onMouseDown={props.actions.showControls}
    className={cx('igui_main', {
      ['igui_state-active']: props.data.visibleControls,
    })}
  >
    {props.data.view === ViewTypes.LOADING && <LoadingView />}
    {props.data.view === ViewTypes.START && <StartView />}
    {props.data.view === ViewTypes.CONTROLS && <ControlsView />}
  </div>
));
