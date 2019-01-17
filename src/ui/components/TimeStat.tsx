import { Icon } from '@src/ui/components/Icon';
import { IData } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface TimeStatProps {
  data: IData;
}

export const TimeStat = withState((props: TimeStatProps) => {
  return (
    <div className="igui_timestat">
      {props.data.timeStat}
    </div>
  );
});
