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
      className="ig-ui--seekbar-hit-area"
      onMouseEnter={props.actions.setSliderActive(SeekbarTypes.PROGRESS)}
      onMouseLeave={props.actions.setSliderInactive(SeekbarTypes.PROGRESS)}
      onMouseDown={props.actions.setSliderSeeking(SeekbarTypes.PROGRESS)}
    >
      <div className={cx('ig-ui--seekbar', {
        'ig-ui--seekbar--active': props.data.isSeekbarActive,
        'ig-ui--seekbar--seeking': props.data.isSeeking,
      })}>
        <div className="ig-ui--seekbar-buffered" style={{ transform: `scaleX(${props.data.bufferedPercentage})` }} />
        <div className="ig-ui--seekbar-progress" style={{ transform: `scaleX(${props.data.progressPercentage})` }} />
        {props.data.isSeekbarActive && !props.data.isSeeking && <div className="ig-ui--seekbar-active-ahead" style={{ transform: `scaleX(${props.data.seekBarPercentage})` }} />}
        <div style={{ transform: `translateX(${props.data.progressPercentage * 100}%)` }}>
          <div className="ig-ui--seekbar-scrubber" />
        </div>
      </div>
    </div>
  );
});
