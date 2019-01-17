import * as React from 'react';
import { withState } from '@src/ui/withState';
import { Button } from '@src/ui/components/Button';
import { IActions, IData } from '@src/ui/types';
import { Seekbar } from '@src/ui/components/Seekbar';
import { VolumeButton } from '@src/ui/components/VolumeButton';
import { Rebuffer } from '@src/ui/components/Rebuffer';

interface ControlsViewProps {
  data: IData,
  actions: IActions,
};

export const ControlsView = withState((props: ControlsViewProps) => {
  return (
    <div className="igui_view_controls">
      {props.data.rebuffering && <Rebuffer />}
      <div className="igui_container_controls">
        <Button name="play" icon={props.data.playRequested ? 'pause' : 'play'} onClick={props.actions.playOrPause} />
        <VolumeButton />
        <div className="igui_container_controls_seekbar">
          <Seekbar />
        </div>
        <Button name="fullscreen" icon={!props.data.isFullscreen ? 'fullscreen' : 'fullscreen-exit'} onClick={props.actions.toggleFullscreen} />
      </div>
    </div>
  );
});
