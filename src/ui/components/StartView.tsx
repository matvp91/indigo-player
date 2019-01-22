import { Icon } from '@src/ui/components/Icon';
import { IActions } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface StartViewProps {
  actions: IActions;
}

export const StartView = withState((props: StartViewProps) => {
  return (
    <button
      type='button'
      className='igui_view_start'
      onClick={props.actions.playOrPause}
    >
      <Icon icon='play' />
    </button>
  );
});
