import { IThumbnail } from '@src/types';
import { Sprite } from '@src/ui/components/Sprite';
import { IInfo } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface CenterProps {
  seekingThumbnail?: IThumbnail;
  playOrPause();
  toggleFullscreen();
}

export const Center = withState((props: CenterProps) => {
  return (
    <div
      className='igui_center'
      onClick={props.playOrPause}
      onDoubleClick={props.toggleFullscreen}
    >
      {!!props.seekingThumbnail && (
        <Sprite className='igui_center_preview' {...props.seekingThumbnail} />
      )}
    </div>
  );
}, mapProps);

function mapProps(info: IInfo): CenterProps {
  return {
    playOrPause: () => info.actions.playOrPause('center'),
    seekingThumbnail: info.data.isSeekbarSeeking
      ? info.data.activeThumbnail
      : null,
    toggleFullscreen: info.actions.toggleFullscreen,
  };
}
