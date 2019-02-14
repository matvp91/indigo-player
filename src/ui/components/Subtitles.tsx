import { Icon } from '@src/ui/components/Icon';
import { Spinner } from '@src/ui/components/Spinner';
import { IInfo } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface SubtitlesProps {
  text: string;
}

export const Subtitles = withState((props: SubtitlesProps) => {
  return !props.text ? null : (
    <div className='igui_subtitles'>
       <span className='igui_subtitles_text'>{props.text}</span>
    </div>
  );
}, mapProps);

function mapProps(info: IInfo): SubtitlesProps {
  return {
    text: info.data.subtitleText,
  };
}
