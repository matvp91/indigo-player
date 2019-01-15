import * as React from 'react';
import cx from 'classnames';
import { Icon } from '@src/ui/components/Icon';

interface ButtonProps {
  children?: JSX.Element | string;
  type?: string;
  icon?: string;
  onClick();
};

export const Button = (props: ButtonProps) => (
  <button
    onClick={props.onClick}
    className="igui_button"
  >
    {!!props.children && props.children}
    {props.icon && <Icon icon={props.icon} />}
  </button>
);
