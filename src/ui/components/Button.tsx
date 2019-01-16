import * as React from 'react';
import cx from 'classnames';
import { Icon } from '@src/ui/components/Icon';

interface ButtonProps {
  children?: JSX.Element | string;
  icon?: string;
  name?: string;
  onClick();
};

export const Button = (props: ButtonProps) => (
  <button
    onClick={props.onClick}
    className={cx('igui_button', {
      [`igui_button_name-${props.name}`]: !!props.name,
    })}
  >
    {!!props.children && props.children}
    {props.icon && <Icon icon={props.icon} />}
  </button>
);
