import * as React from 'react';

import { StateContext } from '@src/ui/State';

export function withState(WrappedComponent) {
  return class extends React.Component {
    render() {
      return (
        <StateContext.Consumer>
          {value => {
            return (
              <WrappedComponent
                {...this.props}
                {...value}
              />
             );
            }
          }
        </StateContext.Consumer>
      );
    }
  }
}