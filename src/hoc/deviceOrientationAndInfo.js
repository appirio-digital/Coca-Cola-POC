import React from 'react';
import { Dimensions, Platform, LayoutAnimation } from 'react-native';

export default WrappedComponent => {
  class ComponentWithDeviceAndOrientation extends React.Component {
    onResize() {
      const dim = Dimensions.get('window');
      const deviceInfo = this.getDeviceWithOrientation(dim);
      this.setState({
        deviceInfo
      });
    }

    componentDidMount() {
      Dimensions.addEventListener('change', this.onResize.bind(this));
    }

    componentWillMount() {
      const dim = Dimensions.get('window');
      const deviceInfo = this.getDeviceWithOrientation(dim);
      this.setState({
        deviceInfo
      });
    }

    componentWillUnmount() {
      Dimensions.removeEventListener('change', this.onResize.bind(this));
    }

    onLayout = e => {
      const dim = Dimensions.get('window');
      const deviceInfo = this.getDeviceWithOrientation(dim);
      this.setState({
        deviceInfo
      });
    };

    getDeviceWithOrientation = dim => {
      const orientation = this.getDeviceOrientation(dim);
      const deviceType = this.getDevice(dim);
      return {
        deviceType,
        orientation,
        dim: { height: dim.height, width: dim.width }
      };
    };

    getDeviceOrientation = dim =>
      dim.height >= dim.width ? 'Portrait' : 'Landscape';

    getDevice = dim => {
      const aspectRatio = dim.height / dim.width;
      return Platform.isPad ? 'Tablet' : 'Phone';
    };

    isDevicePortrait = () => (this.getDeviceOrientation(Dimensions.get('window')) === 'Portrait')

    render() {
      return (
        <WrappedComponent
          {...this.state}
          {...this.props}
          onLayout={this.onLayout}
          isDevicePortrait={this.isDevicePortrait}
        />
      );
    }
  }

  return ComponentWithDeviceAndOrientation;
};
