import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';
import {
  UPDATE_ORIGIN,
  UPDATE_DESTINATION,
  UPDATE_WAYPOINTS,
  UPDATE_ERROR,
  UPDATE_SELECTED_POINT,
  UPDATE_POLYLINE_POINTS,
  RESET_MAP,
  CURRENT_LOCATION
} from './types';
import { labels } from '../../../stringConstants';
import { google_maps_directions_api_endpoint } from '../../../constants';
import { decodePolyline } from '../../../utility/decodePolyline';

export const fetchRoute = () => (dispatch, getState) => {
  const { origin, destination, waypoints } = getState().locations;
  let originString, waypointsString;
  if (origin.activity.address) {
    originString = origin.activity.address;
  } else if (
    origin.coordinate &&
    origin.coordinate.latitude &&
    origin.coordinate.longitude
  ) {
    originString = `${origin.coordinate.latitude},${
      origin.coordinate.longitude
    }`;
  } else {
    return dispatch({
      type: UPDATE_ERROR,
      payload: labels.invalid_origin_error
    });
  }

  if (waypoints && waypoints.length > 0 && waypoints[0].activity.address) {
    waypointsString = `optimize:true|${waypoints
      .map(waypoint => waypoint.activity.address)
      .join('|')}`;
  }

  const request = async () => {
    const url =
      waypoints.length > 0
        ? `${google_maps_directions_api_endpoint}?origin=${originString}&destination=${
            destination.activity.address
          }&waypoints=${waypointsString}&key=${GOOGLE_MAPS_API_KEY}`
        : `${google_maps_directions_api_endpoint}?origin=${originString}&destination=${
            destination.activity.address
          }&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const res = await response.json();
    if (res.error_message) {
      dispatch({
        type: UPDATE_ERROR,
        payload: res.error_message
      });
    } else {
      const { legs, waypoint_order, overview_polyline } = res.routes[0];
      const allCoordinates = [
        simplifiedToSpelledOutPoint(legs[0].start_location),
        ...legs.map(leg => simplifiedToSpelledOutPoint(leg.end_location))
      ];
      dispatch({
        type: UPDATE_ORIGIN,
        payload: {
          ...origin,
          coordinate: allCoordinates[0]
        }
      });

      dispatch({
        type: UPDATE_DESTINATION,
        payload: {
          ...destination,
          coordinate: allCoordinates[allCoordinates.length - 1]
        }
      });

      // Re-order waypoints and set coordinates
      dispatch({
        type: UPDATE_WAYPOINTS,
        payload: waypoint_order
          .map(order => waypoints[order])
          .map((point, index) => ({
            ...point,
            coordinate: simplifiedToSpelledOutPoint(legs[index].end_location)
          }))
      });

      // Parse polyline points to coordinates
      dispatch({
        type: UPDATE_POLYLINE_POINTS,
        payload: decodePolyline(overview_polyline.points)
      });
    }
  };
  request();
};

const simplifiedToSpelledOutPoint = point => ({
  latitude: point.lat,
  longitude: point.lng
});

export const getDeviceLocation = () => (dispatch, getState) => {
  const { origin } = getState();

  navigator.geolocation.getCurrentPosition(
    position => {
      dispatch({
        type: CURRENT_LOCATION,
        payload: {
          ...origin,
          coordinate: position.coords
        }
      });
    },
    error => setError(error),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );
};

export const setOrigin = origin => ({
  type: UPDATE_ORIGIN,
  payload: origin
});

export const setDestination = destination => ({
  type: UPDATE_DESTINATION,
  payload: destination
});

export const setWaypointsArray = waypoints => ({
  type: UPDATE_WAYPOINTS,
  payload: waypoints
});

export const setError = error => {
  return {
    type: UPDATE_ERROR,
    payload:
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error
  };
};

export const setSelectedPoint = payload => ({
  type: UPDATE_SELECTED_POINT,
  payload
});

export const resetMap = () => ({
  type: RESET_MAP
});

export const setPolylinePoints = payload => ({
  type: UPDATE_POLYLINE_POINTS,
  payload
});
