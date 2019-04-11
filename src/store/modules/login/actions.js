import { AsyncStorage } from 'react-native';
import { LOGIN_USER, LOGIN_USER_SUCCESS, LOGIN_USER_FAILED } from './types';
import { CLEAR_STATE } from '../index';
import sampleLoginJSON from './user.json';
import {
  authenticateAnonymousMCS,
  authenticateMCS,
  logoutMCSUser,
  API_NAME,
  API_END_POINT,
  fetchObjectCollection,
  updateCountryCode,
  createNewFile
} from '../../../services/omcClient';
import { labels } from '../../../stringConstants';
import { ASYNC_STORAGE_SYNC_DATE_KEY } from '../../../constants';
import isEmpty from 'lodash/isEmpty';

export const authenticateOAuthMCSUser = (email, password) => dispatch => {
  clearState(dispatch);
  dispatch({
    type: LOGIN_USER
  });
  if (email === 'Coke.User' && password === 'Wipro@1234') {
    loginUserSuccess(dispatch, sampleLoginJSON);
  } else {
    loginUserFailed(dispatch);
  }
};

export const loginAnonymousUser = () => dispatch => {
  dispatch({
    type: LOGIN_USER
  });
  authenticateAnonymousMCS()
    .then(response => {})
    .then(errorCode => {});
};

export const logoutMCS = () => dispatch => {
  logoutMCSUser()
    .then(response => {
      if (response.success) {
        dispatch({
          type: LOGOUT_USER
        });
      }
    })
    .then(errorCode => {});
};

const loginUserFailed = dispatch => {
  let errorMessagePayload = 'Username and password are incorrect.';
  dispatch({
    type: LOGIN_USER_FAILED,
    payload: errorMessagePayload
  });
};

const clearState = dispatch => {
  AsyncStorage.removeItem(ASYNC_STORAGE_SYNC_DATE_KEY);

  dispatch({
    type: CLEAR_STATE
  });
};

const loginUserSuccessOLD = async (dispatch, result) => {
  try {
    const {
      Minimum_Amount,
      Module1,
      PriceBook,
      Prim,
      RouteId,
      SR_Quantity,
      ResourceProfileId,
      Currency
    } = result.userProperties;
    const response = await fetchObjectCollection(
      API_NAME,
      API_END_POINT.USER_PROFILE
    );
    if (response) {
      if (!isEmpty(response)) {
        const {
          __ORACO__DistributionCentre_c,
          PersonFirstName,
          PersonLastName,
          MobileAppIdentifier_c,
          EmailAddress
        } = response[0];
        labels.setLanguage(Prim == 'CA' ? 'en-IE' : 'en-IE');
        updateCountryCode(Prim);
        const user = {
          user: {
            userID: MobileAppIdentifier_c,
            email: EmailAddress,
            firstName: PersonFirstName,
            lastName: PersonLastName
          }
        };
        const profile = {
          ...response[0],
          __ORACO__DistributionCentre_c: PriceBook,
          ResourceProfileId: ResourceProfileId,
          SR_Quantity: SR_Quantity,
          Minimum_Amount: Minimum_Amount,
          module: Module1,
          PriceBook: PriceBook,
          Prim: Prim,
          RouteId: RouteId,
          PrimaryCountry_c: Prim,
          Currency: Currency
        };
        // const routeID = '/ORACO__Route_c/300000014886568/Attachment';
        // const respo = createNewFile(
        //   'Sample.jpeg',
        //   'image/jpeg',
        //   'file:///Users/umangshu/Library/Developer/CoreSimulator/Devices/35740041-2BE4-466A-A315-044902A8F29A/data/Containers/Data/Application/BC4F2B87-AF8C-4C34-8746-F214AB7BFE0F/Documents/300000014886247_LD Red Soft.jpg',
        //   API_NAME,
        //   routeID
        // );

        dispatch({
          type: LOGIN_USER_SUCCESS,
          payload: {
            ...user,
            profile: profile
          }
        });
      } else {
        loginUserFailed(dispatch, null);
      }
    }
  } catch (error) {
    loginUserFailed(dispatch, error.message);
  }
};

const loginUserSuccess = async (dispatch, result) => {
  try {
    const {
      Minimum_Amount,
      Module1,
      Prim,
      RouteId,
      SR_Quantity,
      firstName,
      lastName,
      ResourceProfileId,
      MobileAppIdentifier,
      PriceBook,
      Currency,
      email
    } = result;
    if (result) {
      if (!isEmpty(result)) {
        labels.setLanguage(Prim == 'CA' ? 'en-IE' : 'en-IE');
        updateCountryCode(Prim);
        const user = {
          user: {
            userID: MobileAppIdentifier,
            email: email,
            firstName: firstName,
            lastName: lastName
          }
        };
        const profile = {
          ...result,
          __ORACO__DistributionCentre_c: PriceBook,
          ResourceProfileId: ResourceProfileId,
          SR_Quantity: SR_Quantity,
          Minimum_Amount: Minimum_Amount,
          module: Module1,
          PriceBook: PriceBook,
          Prim: Prim,
          RouteId: RouteId,
          PrimaryCountry_c: Prim,
          Currency: Currency
        };
        // const routeID = '/ORACO__Route_c/300000014886568/Attachment';
        // const respo = createNewFile(
        //   'Sample.jpeg',
        //   'image/jpeg',
        //   'file:///Users/umangshu/Library/Developer/CoreSimulator/Devices/35740041-2BE4-466A-A315-044902A8F29A/data/Containers/Data/Application/BC4F2B87-AF8C-4C34-8746-F214AB7BFE0F/Documents/300000014886247_LD Red Soft.jpg',
        //   API_NAME,
        //   routeID
        // );

        dispatch({
          type: LOGIN_USER_SUCCESS,
          payload: {
            ...user,
            profile: profile
          }
        });
      } else {
        loginUserFailed(dispatch, null);
      }
    }
  } catch (error) {
    loginUserFailed(dispatch, error.message);
  }
};
