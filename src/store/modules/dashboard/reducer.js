import {
  FETCH_DASHBOARD_MENU,
  FETCH_DASHBOARD_MENU_SELECT,
  SET_USER_ONLINE_STATUS,
  FETCH_SIDE_BAR_SCREEN,
  SET_DASHBOARD_MENU
} from './types';
import { CLEAR_STATE } from '../index';
INITIAL_STATE = {
  numOfColumn: 4,
  loading: false,
  isOnline: true,
  isPendingTransaction: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_DASHBOARD_MENU:
      return {
        ...state,
        ...action.payload
      };
    case FETCH_DASHBOARD_MENU:
      return {
        ...state,
        loading: true
      };

    case FETCH_DASHBOARD_MENU_SELECT:
      return {
        ...state,
        selectedMenu: action.payload
      };
    case SET_USER_ONLINE_STATUS:
      return {
        ...state,
        isOnline: action.payload
      };
    case FETCH_SIDE_BAR_SCREEN:
      return {
        ...state,
        screenType: action.screenType,
        accountId: action.account
      };
    case CLEAR_STATE:
      state = [];
    default:
      return state;
  }
};
