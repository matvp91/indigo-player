import * as React from 'react';
import { Icon } from '@src/ui/components/Icon';
import { Spinner } from '@src/ui/components/Spinner';

export const LoadingView = () => (
  <div className="igui_view_loading">
    <Spinner />
  </div>
);