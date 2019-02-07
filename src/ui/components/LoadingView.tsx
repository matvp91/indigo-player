import { Icon } from '@src/ui/components/Icon';
import { Spinner } from '@src/ui/components/Spinner';
import { IInfo } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface LoadingViewProps {
  image: string;
}

export const LoadingView = withState((props: LoadingViewProps) => {
  return (
    <div className='igui_view_loading'>
      {!!props.image && (
        <div
          className='igui_image'
          style={{ backgroundImage: `url(${props.image})` }}
        />
      )}
      <Spinner />
    </div>
  );
}, mapProps);

function mapProps(info: IInfo): LoadingViewProps {
  return {
    image: info.data.image,
  };
}
