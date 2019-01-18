import { Slider } from '@src/ui/components/Slider';
import { IActions, IData } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import cx from 'classnames';
import * as React from 'react';

interface SeekbarProps {
  actions: IActions;
  data: IData;
}

export const Seekbar = withState((props: SeekbarProps) => {
  return (
    <Slider
      className='igui_seekbar'
      onSeeking={props.actions.startSeeking}
      onSeeked={percentage => props.actions.seekToPercentage(percentage)}
      disabled={!!props.data.adBreakData}
    >
      {sliderInfo => {
        let progressPercentage = props.data.progressPercentage;
        if (sliderInfo.isSeeking) {
          progressPercentage = sliderInfo.percentage;
        }

        if (props.data.adBreakData) {
          progressPercentage = props.data.adBreakData.progressPercentage;
        }

        return (
          <div
            className={cx('igui_seekbar_container', {
              igui_seekbar_container_ads: !!props.data.adBreakData,
              'igui_seekbar_state-active': sliderInfo.isHover,
              'igui_seekbar_state-seeking': sliderInfo.isSeeking,
            })}
          >
            <div
              className='igui_seekbar_buffered'
              style={{ transform: `scaleX(${props.data.bufferedPercentage})` }}
            />
            <div
              className='igui_seekbar_progress'
              style={{ transform: `scaleX(${progressPercentage})` }}
            />
            {sliderInfo.isHover && !sliderInfo.isSeeking && (
              <div
                className='igui_seekbar_ahead'
                style={{ transform: `scaleX(${sliderInfo.percentage})` }}
              />
            )}
            <div
              style={{ transform: `translateX(${progressPercentage * 100}%)` }}
            >
              <div className='igui_seekbar_scrubber' />
            </div>
            {!props.data.adBreakData && (
              <div className='igui_seekbar_cuepoints'>
                {props.data.cuePoints.map(cuePoint => (
                  <div
                    key={cuePoint}
                    className='igui_seekbar_cuepoint'
                    style={{ left: `${cuePoint * 100}%` }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      }}
    </Slider>
  );
});
