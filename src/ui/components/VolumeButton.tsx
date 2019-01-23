import { Button } from '@src/ui/components/Button';
import { IActions, IData } from '@src/ui/types';
import { useSlider } from '@src/ui/utils/useSlider';
import { withState } from '@src/ui/withState';
import cx from 'classnames';
import React, { useEffect } from 'react';

interface VolumeButtonProps {
  data: IData;
  actions: IActions;
}

interface VolumeIcon {
  name: string;
  leftOffset: number;
}

const ref = React.createRef();

export const VolumeButton = withState((props: VolumeButtonProps) => {
  let icon: string = 'volume-off';
  if (props.data.volumeBarPercentage > 0.5) {
    icon = 'volume-2';
  } else if (props.data.volumeBarPercentage > 0) {
    icon = 'volume-1';
  }

  useSlider(ref.current as HTMLElement, props.actions.setVolumebarState);

  return (
    <div
      className={cx('igui_volume', {
        'igui_volume_state-open': props.data.isVolumeControlsOpen,
      })}
      onMouseEnter={() => props.actions.setVolumeControlsOpen(true)}
      onMouseLeave={() => props.actions.setVolumeControlsOpen(false)}
    >
      <Button icon={icon} onClick={props.actions.toggleMute} />
      <div className='igui_volume_collapse'>
        <div className='igui_volume_container'>
          <div className='igui_volumebar' ref={ref as any}>
            <div className='igui_volumebar_container'>
              <div
                className='igui_volumebar_progress'
                style={{
                  transform: `scaleX(${props.data.volumeBarPercentage})`,
                }}
              />
              <div
                className='igui_volumebar_scrubber'
                style={{ left: `${props.data.volumeBarPercentage * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
