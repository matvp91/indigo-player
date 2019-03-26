import { IInstance } from '@src/types';
import { Main } from '@src/ui/components/Main';
import { StateStore } from '@src/ui/State';
import React, { RefObject } from 'react';
import * as ReactDOM from 'react-dom';
import { IStateStore } from '@src/ui/types';

export const render = (
  container: HTMLElement,
  state: any,
  instance: IInstance,
  ref: RefObject<IStateStore>
) => {
  ReactDOM.render(
    <StateStore instance={instance} player={state.state} ref={ref as any}>
      <Main />
    </StateStore>,
    container,
  );
};
