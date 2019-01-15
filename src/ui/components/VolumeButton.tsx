import * as React from 'react';
import cx from 'classnames';
import { withState } from '@src/ui/withState';
import { Button } from '@src/ui/components/Button';
import { IActions, IData, SeekbarTypes } from '@src/ui/types';

interface VolumeButtonProps {
  data: IData,
  actions: IActions,
};

export const VolumeButton = withState((props: VolumeButtonProps) => (
  <div
    className={cx('igui_volume', {
      'igui_volume_state-open': props.data.isVolumeControlsOpen,
    })}
    onMouseEnter={props.actions.setVolumeControlsOpen}
    onMouseLeave={props.actions.setVolumeControlsClosed}
   >
    <Button icon="volume-up" type="controls" onClick={props.actions.toggleMute} />
    <div className="igui_volume_collapse">
      <div className="igui_volume_container">
        <div
          className="igui_volumebar"
          onMouseEnter={props.actions.setSliderActive(SeekbarTypes.VOLUME)}
          onMouseLeave={props.actions.setSliderInactive(SeekbarTypes.VOLUME)}
          onMouseDown={props.actions.setSliderSeeking(SeekbarTypes.VOLUME)}
        >
          <div className="igui_volumebar_container">
            <div className="igui_volumebar_progress" style={{ transform: `scaleX(${props.data.volumeBarPercentage})` }} />
            <div style={{ transform: `translateX(${props.data.volumeBarPercentage * 100}%)` }}>
              <div className="igui_volumebar_scrubber" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));