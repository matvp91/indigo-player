import * as React from 'react';
import cx from 'classnames';

interface IconProps {
  icon: string;
}

export const Icon = (props: IconProps) => (
  <i className={cx(
      'fas',
      `fa-${props.icon}`,
      'ig-ui--icon',
      {
         [`ig-ui--icon--${props.icon}`]: !!props.icon,
      },
    )} />
);