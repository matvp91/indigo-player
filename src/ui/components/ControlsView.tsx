import { Button } from '@src/ui/components/Button';
import { Center } from '@src/ui/components/Center';
import { Rebuffer } from '@src/ui/components/Rebuffer';
import { Seekbar } from '@src/ui/components/Seekbar';
import { TimeStat } from '@src/ui/components/TimeStat';
import { VolumeButton } from '@src/ui/components/VolumeButton';
import { Settings } from '@src/ui/components/Settings';
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
      <Settings />
      {props.data.isCenterClickAllowed && <Center />}
      {props.data.rebuffering && <Rebuffer />}
      <div className='igui_container_controls'>
        <Button
          name='play'
          icon={props.data.playRequested ? 'pause' : 'play'}
          onClick={props.actions.playOrPause}
          tooltip={props.data.playRequested ? 'pause': 'play'}
        />
        <VolumeButton />
        <TimeStat />
        <div className='igui_container_controls_seekbar'>
          <Seekbar />
        </div>
        {props.data.pipSupported && (
          <Button
            name='pip'
            icon='pip'
            onClick={props.actions.togglePip}
            tooltip="pip"
          />
        )}
        <Button
          name='settings'
          icon='settings'
          onClick={() => props.actions.toggleSettings()}
          tooltip="settings"
        />
        <Button
          name='fullscreen'
          icon={!props.data.isFullscreen ? 'fullscreen' : 'fullscreen-exit'}
          onClick={props.actions.toggleFullscreen}
          disabled={!props.data.fullscreenSupported}
          tooltip="fullscreen"
        />
      </div>
    </>
  );
});
