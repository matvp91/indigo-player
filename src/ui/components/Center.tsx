import { IInfo } from '@src/ui/types';
import { IThumbnail } from '@src/types';
import { withState } from '@src/ui/withState';
import { Sprite } from '@src/ui/components/Sprite';
import * as React from 'react';

interface CenterProps {
  playOrPause();
  seekingThumbnail?: IThumbnail;
}

export const Center = withState((props: CenterProps) => {
  return (
    <div className='igui_center' onClick={props.playOrPause}>
      {!!props.seekingThumbnail && <Sprite className='igui_center_preview' {...props.seekingThumbnail} />}
    </div>
  );
}, mapProps);

function mapProps(info: IInfo) {
  return {
    playOrPause: info.actions.playOrPause,
    seekingThumbnail: info.data.isSeekbarSeeking ? info.data.activeThumbnail : null,
  };
}
