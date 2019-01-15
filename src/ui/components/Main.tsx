import * as React from 'react';
import cx from 'classnames';
import { withState } from '@src/ui/withState';
import { Button } from '@src/ui/components/Button';
import { IData, IActions, ViewTypes } from '@src/ui/types';
import { StartView } from '@src/ui/components/StartView';
import { ControlsView } from '@src/ui/components/ControlsView';
import { LoadingView } from '@src/ui/components/LoadingView';

interface MainProps {
  data: IData,
  actions: IActions,
};

export const Main = withState((props: MainProps) => (
  <div
    onMouseEnter={props.actions.showControls}
    onMouseMove={props.actions.showControls}
    onMouseLeave={props.actions.hideControls}
    onMouseDown={props.actions.showControls}
    className={cx(
      'ig-ui--main',
      {
        ['ig-ui--active']: props.data.visibleControls,
      },
    )}
  >
    {props.data.view === ViewTypes.LOADING && <LoadingView />}
    {props.data.view === ViewTypes.START && <StartView />}
    {props.data.view === ViewTypes.CONTROLS && <ControlsView />}
  </div>
));
