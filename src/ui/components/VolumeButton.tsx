import * as React from 'react';
import cx from 'classnames';
import { withState } from '@src/ui/withState';
import { Button } from '@src/ui/components/Button';
import { IActions, IData } from '@src/ui/types';

interface VolumeButtonProps {
  data: IData,
  actions: IActions,
};

export const VolumeButton = withState((props: VolumeButtonProps) => (
  <div className="ig-ui--volume">
    <Button icon="volume-up" type="controls" onClick={() => console.log('hi')} />
    <div className="ig-ui--volumebar">
      <div className="ig-ui--volumebar-progress" style={{ transform: `scaleX(${props.data.volumePercentage})` }} />
    </div>
  </div>
));
