import { Button } from '@src/ui/components/Button';
import { Center } from '@src/ui/components/Center';
import { Rebuffer } from '@src/ui/components/Rebuffer';
import { Seekbar } from '@src/ui/components/Seekbar';
import { TimeStat } from '@src/ui/components/TimeStat';
import { VolumeButton } from '@src/ui/components/VolumeButton';
import { IActions, IData } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface ControlsViewProps {
  data: IData;
  actions: IActions;
}

export const ControlsView = withState((props: ControlsViewProps) => {
  return (
    <>
      {props.data.isCenterClickAllowed && <Center />}
      {props.data.rebuffering && <Rebuffer />}
      <div className='igui_container_controls'>
        <Button
          name='play'
          icon={props.data.playRequested ? 'pause' : 'play'}
          onClick={props.actions.playOrPause}
        />
        <VolumeButton />
        <TimeStat />
        <div className='igui_container_controls_seekbar'>
          <Seekbar />
        </div>
        {props.data.pipSupported && !props.data.isPip && (
          <Button name='pip' icon='pip' onClick={props.actions.togglePip} />
        )}
        {!props.data.isPip && (
          <Button
            name='fullscreen'
            icon={!props.data.isFullscreen ? 'fullscreen' : 'fullscreen-exit'}
            onClick={props.actions.toggleFullscreen}
            disabled={!props.data.fullscreenSupported}
          />
        )}
      </div>
    </>
  );
});
