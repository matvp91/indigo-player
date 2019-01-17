import { Icon } from '@src/ui/components/Icon';
import { Spinner } from '@src/ui/components/Spinner';
import * as React from 'react';

export const LoadingView = () => (
  <div className='igui_view_loading'>
    <Spinner />
  </div>
);
