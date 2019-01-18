import { IActions } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface CenterProps {
  actions: IActions;
}

export const Center = withState((props: CenterProps) => {
  return <div className='igui_center' onClick={props.actions.playOrPause} />;
});
