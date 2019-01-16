import * as React from 'react';
import cx from 'classnames';

interface IconProps {
  icon: string;
}

const map = name => {
  if (name === 'play') return 'play_arrow';
  if (name === 'volume') return 'volume_up';
  return name;
};

export const Icon = (props: IconProps) => (
  <i className={cx(
    'igui_icon',
    {
       [`igui_icon_${props.icon}`]: !!props.icon,
    },
    'material-icons',
  )}>
    {map(props.icon)}
  </i>
);