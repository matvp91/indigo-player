import * as React from 'react';
import { withState } from '@src/ui/withState';
import { Icon } from '@src/ui/components/Icon';
import { IActions } from '@src/ui/types';

interface StartViewProps {
  actions: IActions,
};

export const StartView = withState((props: StartViewProps) => {
  return (
    <div className="igui_view_start" onClick={props.actions.playOrPause}>
      <Icon icon="play" />
    </div>
  );
});
