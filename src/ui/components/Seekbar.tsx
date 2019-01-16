import * as React from 'react';
import cx from 'classnames';
import { withState } from '@src/ui/withState';
import { IActions, IData } from '@src/ui/types';
import { Slider } from '@src/ui/components/Slider';

interface SeekbarProps {
  actions: IActions,
  data: IData,
};

export const Seekbar = withState((props: SeekbarProps) => {
  return (
    <Slider
      className="igui_seekbar"
      onSeeked={percentage => props.actions.seekToPercentage(percentage)}
    >
      {sliderInfo => {
        let progressPercentage = props.data.progressPercentage;
        if (sliderInfo.isSeeking) {
          progressPercentage = sliderInfo.percentage;
        }

        return (
          <div className={cx('igui_seekbar_container', {
            'igui_seekbar_state-active': sliderInfo.isHover,
            'igui_seekbar_state-seeking': sliderInfo.isSeeking,
          })}>
            <div className="igui_seekbar_buffered" style={{ transform: `scaleX(${props.data.bufferedPercentage})` }} />
            <div className="igui_seekbar_progress" style={{ transform: `scaleX(${progressPercentage})` }} />
            {sliderInfo.isHover && !sliderInfo.isSeeking && <div className="igui_seekbar_ahead" style={{ transform: `scaleX(${sliderInfo.percentage})` }} />}
            <div style={{ transform: `translateX(${progressPercentage * 100}%)` }}>
              <div className="igui_seekbar_scrubber" />
            </div>
          </div>
        );
      }}
    </Slider>
  );
});
