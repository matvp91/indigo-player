import { Icon } from '@src/ui/components/Icon';
import { IInfo } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface StartViewProps {
  playOrPause();
}

export const StartView = withState((props: StartViewProps) => {
  return (
    <button
      type='button'
      className='igui_view_start'
      onClick={props.playOrPause}
    >
      <Icon icon='play' />
    </button>
  );
}, mapProps);

function mapProps(info: IInfo) {
  return {
    playOrPause: info.actions.playOrPause,
  };
}
