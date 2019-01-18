import { Icon } from '@src/ui/components/Icon';
import cx from 'classnames';
import * as React from 'react';

interface ButtonProps {
  children?: JSX.Element | string;
  icon?: string;
  name?: string;
  disabled?: boolean;
  onClick();
}

export const Button = (props: ButtonProps) => (
  <button
    type="button"
    tabIndex={0}
    onClick={props.onClick}
    className={cx('igui_button', {
      [`igui_button_name-${props.name}`]: !!props.name,
      'igui_button_state-disabled': props.disabled,
    })}
  >
    {!!props.children && props.children}
    {props.icon && <Icon icon={props.icon} />}
  </button>
);
