import { seekbarRef, seekbarTooltipRef, seekbarThumbnailRef } from '@src/ui/State';
import { IActions, IData } from '@src/ui/types';
import { useSlider } from '@src/ui/utils/useSlider';
import { Sprite } from '@src/ui/components/Sprite';
import { withState } from '@src/ui/withState';
import cx from 'classnames';
import React, { useEffect } from 'react';

interface SeekbarProps {
  actions: IActions;
  data: IData;
}

export const Seekbar = withState((props: SeekbarProps) => {
  useSlider(seekbarRef.current as HTMLElement, props.actions.setSeekbarState);

  return (
    <div
      className={cx('igui_seekbar', {
        'igui_seekbar_state-active':
          props.data.isSeekbarHover || props.data.isSeekbarSeeking,
        'igui_seekbar_state-playingad': !!props.data.adBreakData,
      })}
      ref={seekbarRef}
    >
      <div
        ref={seekbarThumbnailRef}
        className='igui_seekbar_thumbnail'
        style={{ left: `${props.data.seekbarThumbnailPercentage * 100}%` }}
      >
        {!!props.data.activeThumbnail && (
          <Sprite
            className='igui_seekbar_thumbnail_sprite'
            {...props.data.activeThumbnail}
          />
        )}
      </div>
      <div
        ref={seekbarTooltipRef}
        className='igui_seekbar_tooltip'
        style={{ left: `${props.data.seekbarTooltipPercentage * 100}%` }}
      >
        {props.data.seekbarTooltipText}
      </div>
      <div
        className='igui_seekbar_scrubber'
        style={{ left: `${props.data.progressPercentage * 100}%` }}
      />
      <div className='igui_seekbar_bars'>
        <div
          className='igui_seekbar_buffered'
          style={{ transform: `scaleX(${props.data.bufferedPercentage})` }}
        />
        <div
          className='igui_seekbar_progress'
          style={{ transform: `scaleX(${props.data.progressPercentage})` }}
        />
        {props.data.isSeekbarHover && !props.data.isSeekbarSeeking && (
          <div
            className='igui_seekbar_ahead'
            style={{ transform: `scaleX(${props.data.seekbarPercentage})` }}
          />
        )}
        {!props.data.adBreakData && !!props.data.cuePoints.length && (
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
    </div>
  );
});
