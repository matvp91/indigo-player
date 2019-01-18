import { IData } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface ErrorViewProps {
  data: IData;
}

export const ErrorView = withState((props: ErrorViewProps) => {
  return (
    <div className='igui_view_error'>
      Something went wrong ({props.data.error.code})
    </div>
  );
});
