import { Button } from '@src/ui/components/Button';
import { IInfo } from '@src/ui/types';
import { useSlider } from '@src/ui/utils/useSlider';
import { withState } from '@src/ui/withState';
import cx from 'classnames';
import React from 'react';

interface VolumeButtonProps {
  volumeIcon: string;
  tooltipText: string;
  isVolumeControlsOpen: boolean;
  volumeBarPercentage: number;
  toggleMute();
  setVolumeControlsOpen(open: boolean);
  setVolumebarState(state: any);
}

const ref = React.createRef();

export const VolumeButton = withState((props: VolumeButtonProps) => {
  useSlider(ref.current as HTMLElement, props.setVolumebarState);

  return (
    <div
      className={cx('igui_volume', {
        'igui_volume_state-open': props.isVolumeControlsOpen,
      })}
      onMouseEnter={() => props.setVolumeControlsOpen(true)}
      onMouseLeave={() => props.setVolumeControlsOpen(false)}
    >
      <Button
        icon={props.volumeIcon}
        onClick={props.toggleMute}
        tooltip={props.tooltipText}
      />
      <div className="igui_volume_collapse">
        <div className="igui_volume_container">
          <div className="igui_volumebar" ref={ref as any}>
            <div className="igui_volumebar_container">
              <div
                className="igui_volumebar_progress"
                style={{
                  transform: `scaleX(${props.volumeBarPercentage})`,
                }}
              />
              <div
                className="igui_volumebar_scrubber"
                style={{ left: `${props.volumeBarPercentage * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}, mapProps);

function mapProps(info: IInfo): VolumeButtonProps {
  let volumeIcon: string = 'volume-off';
  if (info.data.volumeBarPercentage > 0.5) {
    volumeIcon = 'volume-2';
  } else if (info.data.volumeBarPercentage > 0) {
    volumeIcon = 'volume-1';
  }

  return {
    volumeIcon,
    tooltipText: `${info.data.getTranslation(
      info.data.volumeBarPercentage === 0 ? 'Unmute' : 'Mute',
    )} (m)`,
    toggleMute: info.actions.toggleMute,
    setVolumeControlsOpen: info.actions.setVolumeControlsOpen,
    setVolumebarState: info.actions.setVolumebarState,
    isVolumeControlsOpen: info.data.isVolumeControlsOpen,
    volumeBarPercentage: info.data.volumeBarPercentage,
  };
}
