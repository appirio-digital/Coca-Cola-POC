import React from 'react';

import { fetchAndHandleTodaysActivities } from '../services/locationServices';

export default WrappedComponent => {
  class ComponentWithDeviceCurrentLocationListener extends React.Component {
    watchId = null;

    geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000
    };

    state = {
      deviceLocation: {}
    };

    componentDidMount() {
      /*
      this.watchId = navigator.geolocation.watchPosition(
        this.onGeolocationFetched,
        this.onGeolocationFetchError,
        this.geolocationOptions
      );
      */
    }

    componentWillUnmount() {
      /*
      navigator.geolocation.clearWatch(this.watchId);
      */
    }

    onGeolocationFetched = position => {
      this.setState({ deviceLocation: position.coords });
      fetchAndHandleTodaysActivities(position.coords, this.props);
    };

    onGeolocationFetchError(error) {
      console.log('error while fetching location', error);
    }

    render() {
      return <WrappedComponent {...this.state} {...this.props} />;
    }
  }

  return ComponentWithDeviceCurrentLocationListener;
};
