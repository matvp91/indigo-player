import { Button } from '@src/ui/components/Button';
import { Center } from '@src/ui/components/Center';
import { Nod } from '@src/ui/components/Nod';
import { Rebuffer } from '@src/ui/components/Rebuffer';
import { Seekbar } from '@src/ui/components/Seekbar';
import { Settings } from '@src/ui/components/Settings';
import { TimeStat } from '@src/ui/components/TimeStat';
import { VolumeButton } from '@src/ui/components/VolumeButton';
import { IInfo, SettingsTabs } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface ControlsViewProps {
  isCenterClickAllowed: boolean;
  showRebuffer: boolean;
  playIcon: string;
  playTooltipText: string;
  showSubtitlesToggle: boolean;
  isSubtitleActive: boolean;
  subtitleToggleTooltipText: string;
  showPip: boolean;
  pipTooltipText: string;
  settingsTooltipText: string;
  fullscreenIcon: string;
  isFullscreenSupported: boolean;
  fullscreenTooltipText: string;
  isSettingsTabActive: boolean;
  playOrPause();
  toggleActiveSubtitle();
  togglePip();
  toggleSettings();
  toggleFullscreen();
}

export const ControlsView = withState((props: ControlsViewProps) => {
  return (
    <>
      <Nod />
      <Settings />
      {props.isCenterClickAllowed && <Center />}
      {props.showRebuffer && <Rebuffer />}
      <div className="igui_container_controls">
        <Button
          name="play"
          icon={props.playIcon}
          onClick={props.playOrPause}
          tooltip={props.playTooltipText}
        />
        <VolumeButton />
        <TimeStat />
        <div className="igui_container_controls_seekbar">
          <Seekbar />
        </div>
        {props.showSubtitlesToggle && (
          <Button
            name="subtitle"
            icon="cc"
            onClick={props.toggleActiveSubtitle}
            active={props.isSubtitleActive}
            tooltip={props.subtitleToggleTooltipText}
          />
        )}
        {props.showPip && (
          <Button
            name="pip"
            icon="pip"
            onClick={props.togglePip}
            tooltip={props.pipTooltipText}
          />
        )}
        <Button
          name="settings"
          icon="settings"
          onClick={() => props.toggleSettings()}
          tooltip={props.settingsTooltipText}
          active={props.isSettingsTabActive}
        />
        <Button
          name="fullscreen"
          icon={props.fullscreenIcon}
          onClick={props.toggleFullscreen}
          tooltip={props.fullscreenTooltipText}
          disabled={!props.isFullscreenSupported}
        />
      </div>
    </>
  );
}, mapProps);

function mapProps(info: IInfo): ControlsViewProps {
  const createTooltipText = (text: string, shortcut?: string) => {
    return `${info.data.getTranslation(text)} ${
      shortcut ? `(${shortcut})` : ''
    }`.trim();
  };

  return {
    isCenterClickAllowed: info.data.isCenterClickAllowed,
    isSettingsTabActive: info.data.settingsTab !== SettingsTabs.NONE,
    showRebuffer: info.data.rebuffering,
    playIcon: info.data.playRequested ? 'pause' : 'play',
    playOrPause: info.actions.playOrPause,
    playTooltipText: createTooltipText(
      info.data.playRequested ? 'Pause' : 'Play',
      'k',
    ),
    showSubtitlesToggle: !!info.data.subtitles.length,
    isSubtitleActive: !!info.data.activeSubtitle,
    toggleActiveSubtitle: info.actions.toggleActiveSubtitle,
    subtitleToggleTooltipText: createTooltipText(
      !!info.data.activeSubtitle ? 'Disable subtitles' : 'Enable subtitles',
      'c',
    ),
    showPip: info.data.pipSupported && !info.data.pip,
    togglePip: info.actions.togglePip,
    pipTooltipText: createTooltipText('Miniplayer', 'i'),
    toggleSettings: info.actions.toggleSettings,
    settingsTooltipText: createTooltipText('Settings'),
    fullscreenIcon: !info.data.isFullscreen ? 'fullscreen' : 'fullscreen-exit',
    toggleFullscreen: info.actions.toggleFullscreen,
    isFullscreenSupported: info.data.fullscreenSupported,
    fullscreenTooltipText: createTooltipText(
      info.data.isFullscreen ? 'Exit full screen' : 'Full screen',
      'f',
    ),
  };
}
