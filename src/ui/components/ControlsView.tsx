import { Caption } from '@src/types';
import { Button } from '@src/ui/components/Button';
import { Center } from '@src/ui/components/Center';
import { Rebuffer } from '@src/ui/components/Rebuffer';
import { Seekbar } from '@src/ui/components/Seekbar';
import { Settings } from '@src/ui/components/Settings';
import { TimeStat } from '@src/ui/components/TimeStat';
import { VolumeButton } from '@src/ui/components/VolumeButton';
import { IInfo } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface ControlsViewProps {
  isCenterClickAllowed: boolean;
  showRebuffer: boolean;
  playIcon: string;
  playTooltipText: string;
  showCaptionsToggle: boolean;
  isCaptionActive: boolean;
  captionToggleTooltipText: string;
  showPip: boolean;
  pipTooltipText: string;
  settingsTooltipText: string;
  fullscreenIcon: string;
  isFullscreenDisabled: boolean;
  fullscreenTooltipText: string;
  playOrPause();
  toggleActiveCaption();
  togglePip();
  toggleSettings();
  toggleFullscreen();
}

export const ControlsView = withState((props: ControlsViewProps) => {
  return (
    <>
      <Settings />
      {props.isCenterClickAllowed && <Center />}
      {props.showRebuffer && <Rebuffer />}
      <div className='igui_container_controls'>
        <Button
          name='play'
          icon={props.playIcon}
          onClick={props.playOrPause}
          tooltip={props.playTooltipText}
        />
        <VolumeButton />
        <TimeStat />
        <div className='igui_container_controls_seekbar'>
          <Seekbar />
        </div>
        {props.showCaptionsToggle && (
          <Button
            name='caption'
            icon='cc'
            onClick={props.toggleActiveCaption}
            active={props.isCaptionActive}
            tooltip={props.captionToggleTooltipText}
          />
        )}
        {props.showPip && (
          <Button
            name='pip'
            icon='pip'
            onClick={props.togglePip}
            tooltip={props.pipTooltipText}
          />
        )}
        <Button
          name='settings'
          icon='settings'
          onClick={() => props.toggleSettings()}
          tooltip={props.settingsTooltipText}
        />
        <Button
          name='fullscreen'
          icon={props.fullscreenIcon}
          onClick={props.toggleFullscreen}
          disabled={props.isFullscreenDisabled}
          tooltip={props.fullscreenTooltipText}
        />
      </div>
    </>
  );
}, mapProps);

function mapProps(info: IInfo): ControlsViewProps {
  return {
    isCenterClickAllowed: info.data.isCenterClickAllowed,
    showRebuffer: info.data.rebuffering,
    playIcon: info.data.playRequested ? 'pause' : 'play',
    playOrPause: info.actions.playOrPause,
    playTooltipText: info.data.getTranslation(
      info.data.playRequested ? 'Pause' : 'Play',
    ),
    showCaptionsToggle: !!info.data.captions.length,
    isCaptionActive: !!info.data.activeCaption,
    toggleActiveCaption: info.actions.toggleActiveCaption,
    captionToggleTooltipText: info.data.getTranslation(
      !!info.data.activeCaption ? 'Disable subtitles' : 'Enable subtitles',
    ),
    showPip: info.data.pipSupported && !info.data.pip,
    togglePip: info.actions.togglePip,
    pipTooltipText: info.data.getTranslation('Miniplayer'),
    toggleSettings: info.actions.toggleSettings,
    settingsTooltipText: info.data.getTranslation('Settings'),
    fullscreenIcon: !info.data.isFullscreen ? 'fullscreen' : 'fullscreen-exit',
    toggleFullscreen: info.actions.toggleFullscreen,
    isFullscreenDisabled: !info.data.fullscreenSupported,
    fullscreenTooltipText: info.data.getTranslation(
      info.data.isFullscreen ? 'Exit full screen' : 'Full screen',
    ),
  };
}
