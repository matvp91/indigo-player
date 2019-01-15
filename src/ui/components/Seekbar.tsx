import * as React from 'react';
import cx from 'classnames';
import { withState } from '@src/ui/withState';
import { IActions, IData, SeekbarTypes } from '@src/ui/types';

interface SeekbarProps {
  actions: IActions,
  data: IData,
};

export const Seekbar = withState((props: SeekbarProps) => {
  return (
    <div
      className="igui_seekbar"
      onMouseEnter={props.actions.setSliderActive(SeekbarTypes.PROGRESS)}
      onMouseLeave={props.actions.setSliderInactive(SeekbarTypes.PROGRESS)}
      onMouseDown={props.actions.setSliderSeeking(SeekbarTypes.PROGRESS)}
    >
      <div className={cx('igui_seekbar_container', {
        'igui_seekbar_state-active': props.data.isSeekbarActive,
        'igui_seekbar_state-seeking': props.data.isSeeking,
      })}>
        <div className="igui_seekbar_buffered" style={{ transform: `scaleX(${props.data.bufferedPercentage})` }} />
        <div className="igui_seekbar_progress" style={{ transform: `scaleX(${props.data.progressPercentage})` }} />
        {props.data.isSeekbarActive && !props.data.isSeeking && <div className="igui_seekbar_ahead" style={{ transform: `scaleX(${props.data.seekBarPercentage})` }} />}
        <div style={{ transform: `translateX(${props.data.progressPercentage * 100}%)` }}>
          <div className="igui_seekbar_scrubber" />
        </div>
      </div>
    </div>
  );
});
