import * as React from 'react';
import { withState } from '@src/ui/withState';
import { Icon } from '@src/ui/components/Icon';
import { IActions } from '@src/ui/types';

interface StartViewProps {
  actions: IActions,
};

export const StartView = withState((props: StartViewProps) => {
  return (
    <div className="ig-ui--view ig-ui--view--start" onClick={props.actions.play}>
      <Icon icon="play" />
    </div>
  );
});
