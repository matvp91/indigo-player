import { Button } from '@src/ui/components/Button';
import { ControlsView } from '@src/ui/components/ControlsView';
import { ErrorView } from '@src/ui/components/ErrorView';
import { LoadingView } from '@src/ui/components/LoadingView';
import { StartView } from '@src/ui/components/StartView';
import { IInfo, ViewTypes } from '@src/ui/types';
import { attachEvents, EventUnsubscribeFn } from '@src/ui/utils/attachEvents';
import { withState } from '@src/ui/withState';
import cx from 'classnames';
import * as React from 'react';

interface MainProps {
  view: ViewTypes;
  visibleControls: boolean;
}

export const Main = withState(
  (props: MainProps) => (
    <div
      className={cx({
        'igui_state-active': props.visibleControls,
      })}
    >
      {props.view === ViewTypes.ERROR && <ErrorView />}
      {props.view === ViewTypes.LOADING && <LoadingView />}
      {props.view === ViewTypes.START && <StartView />}
      {props.view === ViewTypes.CONTROLS && <ControlsView />}
    </div>
  ),
  mapProps,
);

function mapProps(info: IInfo): MainProps {
  return {
    view: info.data.view,
    visibleControls: info.data.visibleControls,
  };
}
