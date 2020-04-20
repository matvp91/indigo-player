import { Button } from '@src/ui/components/Button';
import { IActions, IData, SettingsTabs } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

const tabs = {};

tabs[SettingsTabs.OPTIONS] = (props: SettingsProps) => (
  <>
    {!!props.data.visibleSettingsTabs.length ? (
      <SettingsSelect
        onClick={props.actions.setSettingsTab}
        items={[
          props.data.visibleSettingsTabs.includes(SettingsTabs.TRACKS) && {
            item: SettingsTabs.TRACKS,
            label: props.data.getTranslation('Quality'),
            info: `${
              props.data.activeTrack ? props.data.activeTrack.height : ''
            }`,
          },
          props.data.visibleSettingsTabs.includes(SettingsTabs.SUBTITLES) && {
            item: SettingsTabs.SUBTITLES,
            label: props.data.getTranslation('Subtitles'),
            info: `${
              props.data.activeSubtitle ? props.data.activeSubtitle.label : ''
            }`,
          },
          props.data.visibleSettingsTabs.includes(
            SettingsTabs.PLAYBACKRATES,
          ) && {
            item: SettingsTabs.PLAYBACKRATES,
            label: props.data.getTranslation('Speed'),
            info: `${props.data.playbackRate ? props.data.playbackRate : ''}`,
          },
        ].filter(item => !!item)}
      />
    ) : (
      <div className="igui_settings_nooptions">No settings available</div>
    )}
  </>
);

tabs[SettingsTabs.TRACKS] = (props: SettingsProps) => (
  <>
    <SettingsHeader
      title={props.data.getTranslation('Quality')}
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
          label: `${track.height}`,
        })),
        {
          item: 'auto',
          label: props.data.getTranslation('Automatic quality'),
        },
      ]}
    />
  </>
);

tabs[SettingsTabs.SUBTITLES] = (props: SettingsProps) => (
  <>
    <SettingsHeader
      title={props.data.getTranslation('Subtitles')}
      onBackClick={() => props.actions.setSettingsTab(SettingsTabs.OPTIONS)}
    />
    <SettingsSelect
      selected={props.data.activeSubtitle}
      onClick={subtitle => {
        props.actions.selectSubtitle(subtitle);
        props.actions.toggleSettings();
      }}
      items={[
        ...props.data.subtitles.map(subtitle => ({
          item: subtitle,
          label: subtitle.label,
        })),
        {
          item: null,
          label: props.data.getTranslation('No subtitles'),
        },
      ]}
    />
  </>
);

tabs[SettingsTabs.PLAYBACKRATES] = (props: SettingsProps) => (
  <>
    <SettingsHeader
      title={props.data.getTranslation('Speed')}
      onBackClick={() => props.actions.setSettingsTab(SettingsTabs.OPTIONS)}
    />
    <SettingsSelect
      selected={props.data.playbackRate}
      onClick={playbackRate => {
        props.actions.setPlaybackRate(playbackRate);
        props.actions.toggleSettings();
      }}
      items={[
        {
          item: 0.25,
          label: '0.25',
        },
        {
          item: 0.5,
          label: '0.5',
        },
        {
          item: 1,
          label: props.data.getTranslation('Normal speed'),
        },
        {
          item: 1.5,
          label: '1.5',
        },
        {
          item: 2,
          label: '2',
        },
      ]}
    />
  </>
);

interface SettingsHeaderProps {
  title: string;
  onBackClick?();
  onOptionsClick?();
}

const SettingsHeader = (props: SettingsHeaderProps) => (
  <div className="igui_settings_header">
    {!!props.onBackClick && (
      <Button onClick={props.onBackClick} name="settings-back" icon="back" />
    )}
    {props.title}
    {!!props.onOptionsClick && (
      <Button onClick={props.onOptionsClick} name="settings-options">
        Options
      </Button>
    )}
  </div>
);

interface SettingsSelectProps {
  selected?: any;
  items: Array<{
    item: any;
    label: string;
    info?: string;
  }>;
  onClick(item: any);
}

const SettingsSelect = (props: SettingsSelectProps) => (
  <div className="igui_settings_select">
    {props.items.map(item => (
      <Button
        key={item.label}
        name="select-option"
        onClick={() => props.onClick(item.item)}
        active={item.item === props.selected}
      >
        <>
          {item.label}
          {item.info && (
            <span className="igui_settings_select_option_info">
              {item.info}
            </span>
          )}
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
    <div className="igui_settings">
      {props.data.isMobile && (
        <Button name="mobile-close" onClick={props.actions.toggleSettings}>
          &times;
        </Button>
      )}
      {renderTab(props)}
    </div>
  ) : null;
});
