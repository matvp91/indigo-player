import { IActions, IData } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import { Sprite } from '@src/ui/components/Sprite';
import * as React from 'react';

interface CenterProps {
  actions: IActions;
  data: IData;
}

export const Center = withState((props: CenterProps) => {
  return (
    <div className='igui_center' onClick={props.actions.playOrPause}>
      {!!props.data.activeThumbnail && props.data.isSeekbarSeeking && <Sprite className='igui_center_preview' {...props.data.activeThumbnail} />}
    </div>
  );
});
