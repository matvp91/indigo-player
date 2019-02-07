import cx from 'classnames';
import * as React from 'react';

interface IconProps {
  icon: string;
}

export const Icon = (props: IconProps) => (
  <i
    className={cx(
      'igui_icon',
      {
        [`igui_icon_${props.icon}`]: !!props.icon,
      },
      'igui-icon-font',
      `igui_icon_${props.icon}`,
    )}
  />
);
