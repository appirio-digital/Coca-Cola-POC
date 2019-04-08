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
import { CLEAR_STATE } from '../index';

const INITIAL_STATE = {
  origin: {
    activity: null,
    coordinate: null
  },
  destination: {
    activity: null,
    coordinate: null
  },
  waypoints: [],
  error: null,
  selectedPoint: null,
  polyline_points: []
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case UPDATE_ORIGIN:
      return {
        ...state,
        origin:
          payload.activity && payload.coordinate
            ? {
                activity: payload.activity,
                coordinate: payload.coordinate
              }
            : { activity: payload }
      };

    case CURRENT_LOCATION:
      return {
        ...state,
        origin: payload.coordinate
          ? {
              coordinate: payload.coordinate
            }
          : { coordinate: '' }
      };

    case RESET_MAP:
      return INITIAL_STATE;

    case UPDATE_DESTINATION:
      return {
        ...state,
        destination:
          payload.activity && payload.coordinate
            ? {
                activity: payload.activity,
                coordinate: payload.coordinate
              }
            : { activity: payload }
      };

    case UPDATE_WAYPOINTS:
      let newactivities = [];
      payload.map(waypoint => {
        let newPayload =
          waypoint.activity && waypoint.coordinate
            ? {
                activity: waypoint.activity,
                coordinate: waypoint.coordinate
              }
            : {
                activity: waypoint
              };
        newactivities.push(newPayload);
      });
      return {
        ...state,
        waypoints: newactivities
      };

    case UPDATE_ERROR:
      return {
        ...state,
        error: payload
      };

    case UPDATE_SELECTED_POINT:
      return {
        ...state,
        selectedPoint: payload
      };

    case UPDATE_POLYLINE_POINTS:
      return {
        ...state,
        polyline_points: payload
      };
    case CLEAR_STATE:
      state = [];
    default:
      return state;
  }
};
