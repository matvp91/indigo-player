import { Icon } from '@src/ui/components/Icon';
import { IInfo } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import cx from 'classnames';
import React from 'react';

interface NodProps {
  icon: string;
}

export const Nod = withState((props: NodProps) => {
  return (
    <div
      className={cx('igui_nod', {
        'igui_nod-active': !!props.icon,
      })}
    >
      <Icon icon={props.icon} />
    </div>
  );
}, mapProps);

function mapProps(info: IInfo): NodProps {
  return {
    icon: info.data.nodIcon,
  };
}
