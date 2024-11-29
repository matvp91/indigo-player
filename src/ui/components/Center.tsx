import { IThumbnail } from '@src/types';
import { Sprite } from '@src/ui/components/Sprite';
import { IInfo } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface CenterProps {
  seekingThumbnail?: IThumbnail;
  logo;
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
      {props.logo.url && (
        <div className={'igui_logo ' + ((props.logo.position && props.logo.position[1] == 'right') ? 'igui_logo_right' : '') + ' ' + ((props.logo.position && props.logo.position[0] == 'bottom') ? 'igui_logo_bottom' : '') } style={{ 'backgroundImage': 'url("' + props.logo.url + '")' }}>
        </div>
      )}
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
    logo: info.data.logo,
    toggleFullscreen: info.actions.toggleFullscreen,
  };
}
