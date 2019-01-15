import * as React from 'react';
import cx from 'classnames';

interface IconProps {
  icon: string;
}

export const Icon = (props: IconProps) => (
  <i className={cx(
      'fas',
      `fa-${props.icon}`,
      'igui_icon',
      {
         [`igui_icon_${props.icon}`]: !!props.icon,
      },
    )} />
);