import { StateContext } from '@src/ui/State';
import { IInfo } from '@src/ui/types';
import React, { memo } from 'react';

export function withState(WrappedComponent, mapProps = null) {
  const MemoizedWrappedComponent = memo(WrappedComponent);

  return class extends React.PureComponent {
    public render() {
      return (
        <StateContext.Consumer>
          {(info: IInfo) => {
            if (mapProps) {
              info = mapProps(info, this.props);
            } // This is temporary, once all components are integrated with mapProps, remove.
            return <MemoizedWrappedComponent {...this.props} {...info} />;
          }}
        </StateContext.Consumer>
      );
    }
  };
}
