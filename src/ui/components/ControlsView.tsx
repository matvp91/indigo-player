import { Button } from '@src/ui/components/Button';
import { Center } from '@src/ui/components/Center';
import { Rebuffer } from '@src/ui/components/Rebuffer';
import { Seekbar } from '@src/ui/components/Seekbar';
import { Settings } from '@src/ui/components/Settings';
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
      <Settings />
      {props.data.isCenterClickAllowed && <Center />}
      {props.data.rebuffering && <Rebuffer />}
      <div className='igui_container_controls'>
        <Button
          name='play'
          icon={props.data.playRequested ? 'pause' : 'play'}
          onClick={props.actions.playOrPause}
          tooltip={props.data.getTranslation(
            props.data.playRequested ? 'Pause' : 'Play',
          )}
        />
        <VolumeButton />
        <TimeStat />
        <div className='igui_container_controls_seekbar'>
          <Seekbar />
        </div>
        {!!props.data.captions.length && (
          <Button
            name='caption'
            icon='cc'
            onClick={props.actions.toggleActiveCaption}
            active={!!props.data.activeCaption}
            tooltip={props.data.getTranslation(!!props.data.activeCaption ? 'Disable subtitles' : 'Enable subtitles')}
          />
        )}
        {props.data.pipSupported && !props.data.pip && (
          <Button
            name='pip'
            icon='pip'
            onClick={props.actions.togglePip}
            tooltip={props.data.getTranslation('Miniplayer')}
          />
        )}
        <Button
          name='settings'
          icon='settings'
          onClick={() => props.actions.toggleSettings()}
          tooltip={props.data.getTranslation('Settings')}
        />
        <Button
          name='fullscreen'
          icon={!props.data.isFullscreen ? 'fullscreen' : 'fullscreen-exit'}
          onClick={props.actions.toggleFullscreen}
          disabled={!props.data.fullscreenSupported}
          tooltip={props.data.getTranslation(
            props.data.isFullscreen ? 'Exit full screen' : 'Full screen',
          )}
        />
      </div>
    </>
  );
});
