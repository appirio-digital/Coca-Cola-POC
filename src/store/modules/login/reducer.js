import { LOGIN_USER_SUCCESS, LOGIN_USER_FAILED, LOGIN_USER } from './types';
import { CLEAR_STATE } from '../index';

const INITIAL_STATE = {
  user: null,
  errorMessage: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        profile: action.payload.profile,
        user: action.payload.user,
        loading: false
      };
    case LOGIN_USER_FAILED:
      return { ...state, errorMessage: action.payload, loading: false };
    case LOGIN_USER:
      return { ...state, errorMessage: '', loading: true };
    case CLEAR_STATE:
      state = [];
    default:
      return state;
  }
};
