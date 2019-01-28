import { IData, IActions, SettingsTabs } from '@src/ui/types';
import { Button } from '@src/ui/components/Button';
import { withState } from '@src/ui/withState';
import * as React from 'react';

const tabs = {};

tabs[SettingsTabs.OPTIONS] = (props: SettingsProps) => (
  <>
    <SettingsSelect
      onClick={props.actions.setSettingsTab}
      items={[
        {
          item: SettingsTabs.TRACKS,
          label: 'Quality',
          info: `${props.data.activeTrack ? props.data.activeTrack.width : ''}`,
        },
        {
          item: SettingsTabs.CAPTIONS,
          label: 'Subtitles',
          info: `${props.data.activeCaption ? props.data.activeCaption.label : ''}`,
        },
      ]}
    />
  </>
);

tabs[SettingsTabs.TRACKS] = (props: SettingsProps) => (
  <>
    <SettingsHeader
      title="Quality"
      onBackClick={() => props.actions.setSettingsTab(SettingsTabs.OPTIONS)}
    />
    <SettingsSelect
      selected={props.data.selectedTrack}
      onClick={track => {
        props.actions.selectTrack(track);
        props.actions.toggleSettings();
      }}
      items={[
        ...props.data.tracks.map(track => ({
          item: track,
          label: `${track.width}`,
        })),
        {
          item: 'auto',
          label: 'Auto',
        },
      ]}
    />
  </>
);

tabs[SettingsTabs.CAPTIONS] = (props: SettingsProps) => (
  <>
    <SettingsHeader
      title="Captions"
      onBackClick={() => props.actions.setSettingsTab(SettingsTabs.OPTIONS)}
    />
    <SettingsSelect
      selected={props.data.activeCaption}
      onClick={caption => {
        props.actions.selectCaption(caption);
        props.actions.toggleSettings();
      }}
      items={props.data.captions.map(caption => ({
        item: caption,
        label: caption.label,
      }))}
    />
  </>
);

interface SettingsHeaderProps {
  onBackClick?();
  title: string;
}

const SettingsHeader = (props: SettingsHeaderProps) => (
  <div className='igui_settings_header'>
    {!!props.onBackClick && <Button onClick={props.onBackClick} name="settings-back" icon="back" />}
    {props.title}
  </div>
);

interface SettingsSelectProps {
  onClick(item: any);
  selected?: any;
  items: Array<{
    item: any,
    label: string,
    info?: string,
  }>
}

const SettingsSelect = (props: SettingsSelectProps) => (
  <div className='igui_settings_select'>
    {props.items.map(item => (
      <Button key={item.label} name='select-option' onClick={() => props.onClick(item.item)} active={item.item === props.selected}>
        <>
          {item.label}
          {item.info && <span className='igui_settings_select_option_info'>{item.info}</span>}
        </>
      </Button>
    ))}
  </div>
);

interface SettingsProps {
  data: IData;
  actions: IActions;
}

export const Settings = withState((props: SettingsProps) => {
  const renderTab = tabs[props.data.settingsTab];
  return renderTab ? (
    <div className='igui_settings'>
      {renderTab(props)}
    </div>
  ) : null;
});
