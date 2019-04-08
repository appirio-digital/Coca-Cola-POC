import React from 'react';

export default (state, props) => WrappedComponent => {
  class ConnectedComponent extends React.Component {
    render() {
      return <WrappedComponent {...state} {...props} />;
    }
  }

  return ConnectedComponent;
};
