import { IThumbnail } from '@src/types';
import { Sprite } from '@src/ui/components/Sprite';
import { IInfo } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface CenterProps {
  seekingThumbnail?: IThumbnail;
  playOrPause();
}

export const Center = withState((props: CenterProps) => {
  return (
    <div className='igui_center' onClick={props.playOrPause}>
      {!!props.seekingThumbnail && (
        <Sprite className='igui_center_preview' {...props.seekingThumbnail} />
      )}
    </div>
  );
}, mapProps);

function mapProps(info: IInfo): CenterProps {
  return {
    playOrPause: info.actions.playOrPause,
    seekingThumbnail: info.data.isSeekbarSeeking
      ? info.data.activeThumbnail
      : null,
  };
}
