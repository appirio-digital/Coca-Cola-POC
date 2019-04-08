import {
  FETCH_DASHBOARD_MENU,
  FETCH_DASHBOARD_MENU_SELECT,
  SET_USER_ONLINE_STATUS,
  FETCH_SIDE_BAR_SCREEN,
  SET_DASHBOARD_MENU
} from './types';
import { AsyncStorage } from 'react-native';

import { NativeModules } from 'react-native';

export const setUserOnlineStatus = status => {
  AsyncStorage.setItem('ForceOfflineFlag', status != true ? 'true' : 'false');
  NativeModules.SyncManager.setOfflineMode({ connectivity: status });
  return {
    type: SET_USER_ONLINE_STATUS,
    payload: status
  };
};

export const fetchDashBoardMenu = () => {
  return {
    type: FETCH_DASHBOARD_MENU
  };
};

export const setDashBoardMenu = menu => {
  return {
    type: SET_DASHBOARD_MENU,
    payload: menu
  };
};

export const setSelectedMenu = id => {
  return {
    type: FETCH_DASHBOARD_MENU_SELECT,
    payload: id
  };
};

const fetchDashBoardMenuSuccess = result => {
  dispatch({
    type: FETCH_DASHBOARD_MENU_SUCCESS,
    payload: result
  });
};

const fetchDashBoardMenuFailed = errorObject => {
  let errorMessagePayload = 'Not abel to download the dashboard menu.';
  if (errorObject.message) {
    errorMessagePayload = errorObject.message;
  }
  dispatch({
    type: FETCH_DASHBOARD_MENU_FAIL,
    payload: errorMessagePayload
  });
};

export const fetchSidebarScreenType = (screenType, account) => ({
  type: FETCH_SIDE_BAR_SCREEN,
  screenType,
  account
});
