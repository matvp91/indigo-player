import React from 'react';
import { KeyboardNavigationPurpose } from '@src/types';
import { IInfo } from '@src/ui/types';
import { withState } from '@src/ui/withState';

interface NodProps {
  purpose: KeyboardNavigationPurpose;
}

export const Nod = withState(
  (props: NodProps) => {
    return (
      <div className="igui_nod">{props.purpose}</div>
    );
  },
  mapProps,
);

function mapProps(info: IInfo): NodProps {
  return {
    purpose: info.data.nodPurpose,
  };
}
