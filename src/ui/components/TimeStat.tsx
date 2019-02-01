import { Icon } from '@src/ui/components/Icon';
import { IInfo } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import React from 'react';

interface TimeStatProps {
  timeStatPosition: string;
  timeStatDuration: string;
}

export const TimeStat = withState((props: TimeStatProps) => {
  return (
    <div className='igui_timestat'>
      <div className='igui_timestat_position'>{props.timeStatPosition}</div>
      <div className='igui_timestat_duration'>{props.timeStatDuration}</div>
    </div>
  );
}, mapProps);

function mapProps(info: IInfo): TimeStatProps {
  return {
    timeStatPosition: info.data.timeStatPosition,
    timeStatDuration: info.data.timeStatDuration,
  };
}
