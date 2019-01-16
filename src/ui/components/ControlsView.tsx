import * as React from 'react';
import { withState } from '@src/ui/withState';
import { Button } from '@src/ui/components/Button';
import { IActions, IData } from '@src/ui/types';
import { Seekbar } from '@src/ui/components/Seekbar';
import { VolumeButton } from '@src/ui/components/VolumeButton';

interface ControlsViewProps {
  data: IData,
  actions: IActions,
};

export const ControlsView = withState((props: ControlsViewProps) => {
  return (
    <div className="igui_view_controls">
      <div className="igui_container_controls">
        {props.data.paused
          ? <Button name="playpause" type="controls" icon="play" onClick={props.actions.play} />
          : <Button name="playpause" type="controls" icon="pause" onClick={props.actions.pause} />
        }
        <VolumeButton />
        {/*<Button type="controls" icon="arrows-alt" onClick={props.actions.toggleFullscreen} />*/}
        <div className="igui_container_controls_seekbar">
          <Seekbar />
        </div>
      </div>
    </div>
  );
});
