import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Main } from '@src/ui/components/Main';
import { Instance } from '@src/Instance';
import { StateStore } from '@src/ui/State';

export const render = (container: HTMLElement, state: any, instance: Instance) => {
  ReactDOM.render(
    <StateStore instance={instance} player={state.state}>
      <Main />
    </StateStore>,
    container,
  );
};
