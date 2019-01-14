import * as React from 'react';
import { withState } from '@src/ui/withState';
import { IActions, IData } from '@src/ui/types';

interface SeekbarProps {
  actions: IActions,
  data: IData,
};

export const Seekbar = withState((props: SeekbarProps) => {
  return (
    <div className="ig-ui--seekbar">
      Seekbar
    </div>
  );
});
