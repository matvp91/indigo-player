import { IInfo } from '@src/ui/types';
import { IPlayerError } from '@src/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface ErrorViewProps {
  error: IPlayerError,
}

export const ErrorView = withState((props: ErrorViewProps) => {
  return (
    <div className='igui_view_error'>
      Something went wrong ({props.error.code})
    </div>
  );
}, mapProps);

function mapProps(info: IInfo) {
  return {
    error: info.data.error,
  };
}
