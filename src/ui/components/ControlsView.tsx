import * as React from 'react';
import { withState } from '@src/ui/withState';
import { Button } from '@src/ui/components/Button';
import { IActions, IData } from '@src/ui/types';
import { Seekbar } from '@src/ui/components/Seekbar';

interface ControlsViewProps {
  data: IData,
  actions: IActions,
};

export const ControlsView = withState((props: ControlsViewProps) => {
  return (
    <div className="ig-ui--view ig-ui--view--controls">
      <div className="ig-ui--controls">
        <Seekbar />
        <div className="ig-ui--controls--buttons">
          {props.data.paused
            ? <Button type="controls" icon="play" onClick={props.actions.play} />
            : <Button type="controls" icon="pause" onClick={props.actions.pause} />
          }
        </div>
      </div>
    </div>
  );
});
