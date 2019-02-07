import { Icon } from '@src/ui/components/Icon';
import { IInfo } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface StartViewProps {
  image: string;
  playOrPause();
}

export const StartView = withState((props: StartViewProps) => {
  return (
    <button
      type='button'
      className='igui_view_start'
      onClick={props.playOrPause}
    >
      {!!props.image && (
        <div
          className='igui_image'
          style={{ backgroundImage: `url(${props.image})` }}
        />
      )}
      <Icon icon='play' />
    </button>
  );
}, mapProps);

function mapProps(info: IInfo): StartViewProps {
  return {
    playOrPause: info.actions.playOrPause,
    image: info.data.image,
  };
}
