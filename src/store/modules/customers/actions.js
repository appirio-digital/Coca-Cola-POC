import { isEmpty, find, orderBy } from 'lodash';
import moment from 'moment';
import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';
import {
  GET_CUSTOMERS,
  GET_ACTIVITY,
  TODAYS_ACTIVITIES,
  LOADING_TODAYS_ACTIVITIES,
  SET_DATE,
  GET_CUSTOMER_INVOICE,
  GET_CUSTOMER_ORDER,
  GET_CUSTOMER_PAYMENT_HISTORY,
  GET_PROMOTIONS,
  CUSTOMER_LOADING,
  GET_CUSTOMERS_CONTACT,
  RESET_CUSTOMERS,
  GET_CREDIT_NOTES,
  RELOAD_CUSTOMERS,
  RELOAD_ORDERS
} from './types';
import paymentData from './paymentHistory.json';
import promotionsData from './promotionList.json';
import {
  isAfter,
  isBefore,
  formatDateMMDD,
  isDateValid
} from '../../../utility';
import creditNotesData from './creditNotes.json';
import {
  google_maps_geocoding_api_endpoint,
  APP_ROUTE
} from '../../../constants';
import { labels } from '../../../stringConstants';
import JSONfn from 'json-fn';

import {
  fetchObjectCollection,
  API_END_POINT,
  API_NAME,
  API_NAME_POC,
  API_JTI_CUSTOMER_API,
  JTI_API
} from '../../../services/omcClient';
import customer from './customer.json';
import activity from './activity.json';

export const getCustomers = activityList => {
  const data = getCustomerListData(activityList);

  return {
    type: GET_CUSTOMERS,
    payload: data
  };
};

export const setFilterInitialDate = (from, to) => {
  return {
    type: SET_DATE,
    payload: { fromDate: from, toDate: to }
  };
};

export const getAllCustomers = () => async dispatch => {
  try {
    dispatch({
      type: CUSTOMER_LOADING,
      loading: true
    });
    var response = await fetchObjectCollection(
      API_JTI_CUSTOMER_API,
      API_END_POINT.CUSTOMERS
    );

    response = response.map(customer => {
      if (customer.contacts) {
        const contacts = JSONfn.parse(customer.contacts);
        customer = { ...customer, contacts: contacts };
      }

      if (customer.address) {
        const address = JSONfn.parse(customer.address);
        customer = { ...customer, address: address };
      }

      if (customer.extension) {
        const extension = JSONfn.parse(customer.extension);
        customer = { ...customer, extension: extension };
      }
      return customer;
    });

    console.log('New customer list AFTER', response);

    dispatch({
      type: GET_CUSTOMERS,
      payload: response,
      loading: false
    });
  } catch (error) {
    dispatch({
      type: CUSTOMER_LOADING,
      loading: false
    });
  }
};

export const getCustomersContact = (PartyNumber, SourceSystem) => dispatch => {
  fetchObjectCollection(API_NAME, API_END_POINT.CONTACT)
    .then(response => {
      response = response.filter(item => {
        return (
          item.AccountPartyNumber == PartyNumber ||
          item.SourceSystemReferenceValue == SourceSystem
        );
      });
      dispatch({
        type: GET_CUSTOMERS_CONTACT,
        payload: response
      });
    })
    .catch(error => {
      console.log(error);
    });
};

export const getInvoicePayment = () => async dispatch => {
  dispatch({
    type: CUSTOMER_LOADING,
    loading: true
  });
  try {
    const response = await fetchObjectCollection(
      API_NAME_POC,
      API_END_POINT.INVOICE_PAYMENT
    );
    dispatch({
      type: CUSTOMER_LOADING,
      loading: false
    });
    return response;
  } catch (error) {
    console.log(error);
    dispatch({
      type: CUSTOMER_LOADING,
      loading: false
    });
  }
};

export const getInvoicePaymentLine = () => async dispatch => {
  dispatch({
    type: CUSTOMER_LOADING,
    loading: true
  });
  try {
    const response = await fetchObjectCollection(
      API_NAME_POC,
      API_END_POINT.INVOICE_PAYMENT_LINE
    );
    dispatch({
      type: CUSTOMER_LOADING,
      loading: false
    });
    return response;
  } catch (error) {
    console.log(error);
    dispatch({
      type: CUSTOMER_LOADING,
      loading: false
    });
  }
};

export const getCustomerCreditNotes = invoiceId => {
  return {
    type: GET_CREDIT_NOTES,
    payload: creditNotesData.items
  };
};

export const getCustomerInvoice = () => async dispatch => {
  dispatch({
    type: CUSTOMER_LOADING,
    loading: true
  });
  try {
    const response = await fetchObjectCollection(
      API_NAME_POC,
      API_END_POINT.INVOICE_HEADER
    );
    dispatch({
      type: CUSTOMER_LOADING,
      loading: false
    });
    const sortedInvoice = orderBy(response, invoice => {
      return new moment(invoice.__ORACO__InvoiceDate_c).format('YYYYMMDD');
    }).reverse();
    return sortedInvoice;
  } catch (error) {
    console.log(error);
    dispatch({
      type: CUSTOMER_LOADING,
      loading: false
    });
  }
};

export const getCustomerOrder = () => async dispatch => {
  dispatch({
    type: CUSTOMER_LOADING,
    loading: true
  });
  try {
    const order = await fetchObjectCollection(
      API_NAME_POC,
      API_END_POINT.CUSTOMER_ORDER
    );
    const orderItems = await fetchObjectCollection(
      API_NAME_POC,
      API_END_POINT.ORDER_LINE_ITEM
    );
    const sortedOrder = orderBy(order, order1 => {
      return new moment(order1.OrderDate_c).format('YYYYMMDD');
    }).reverse();
    const orderWithLineItem = sortedOrder.map(order => {
      const lineItems = orderItems
        .filter(
          orderitem =>
            orderitem.Order_Id_c == order.Id ||
            orderitem.ParentMobileUId_c == order.MobileUId_c
        )
        .map(order => {
          return { ...order, selected: false };
        });

      return { ...order, orderItem: lineItems };
    });
    dispatch({
      type: GET_CUSTOMER_ORDER,
      payload: orderWithLineItem
    });

    dispatch({
      type: CUSTOMER_LOADING,
      loading: false
    });
    return orderWithLineItem;
  } catch (error) {
    console.log(error);
    dispatch({
      type: CUSTOMER_LOADING,
      loading: false
    });
  }
};

export const getActivity = (from, to) => async dispatch => {
  dispatch({
    type: CUSTOMER_LOADING,
    loading: true
  });
  if (!(from && to && isDateValid(from) && isDateValid(to))) {
    from = formatDateMMDD(new Date());
    to = formatDateMMDD(new Date());
  }

  try {
    const activities = await fetchAllActivitiesAndPopulateAccount();

    dispatch({
      type: GET_ACTIVITY,
      payload: setFilterDate(from, to, activities),
      loading: false
    });
  } catch (error) {
    dispatch({
      type: GET_ACTIVITY,
      loading: false
    });
  }
};

const fetchAllActivitiesAndPopulateAccount = async () => {
  // Fetching Activities
  let results = await fetchObjectCollection(JTI_API, API_END_POINT.ACTIVITY);
  // let results = activity.items;
  if (results.length > 0) {
    const filtredSR = results.filter(
      activity =>
        activity.function === 'TASK' &&
        activity.subtype === 'STOCK_REQUEST' &&
        activity.duedate === moment(new Date()).format('YYYY-MM-DD')
    );

    // const customers = customer.items;
    const customers = await fetchObjectCollection(
      API_JTI_CUSTOMER_API,
      API_END_POINT.CUSTOMERS
    );

    customers = customers.map(customer => {
      if (customer.contacts) {
        const contacts = JSONfn.parse(customer.contacts);
        customer = { ...customer, contacts: contacts };
      }

      if (customer.address) {
        const address = JSONfn.parse(customer.address);
        customer = { ...customer, address: address };
      }

      if (customer.extension) {
        const extension = JSONfn.parse(customer.extension);
        customer = { ...customer, extension: extension };
      }
      return customer;
    });

    const filteredActivities = results.filter(
      activity => activity.function === 'APPOINTMENT' && activity.routeid
    );
    try {
      const activityResult = filteredActivities.reduce(
        (accumulator, activity) => {
          const customerRecord = find(
            customers,
            customer => customer.id == activity.accountid
          );

          if (customerRecord) {
            const address = [];
            if (!isEmpty(customerRecord.address)) {
              let addressElement = customerRecord.address[0];
              if (addressElement) {
                for (var prop in addressElement) {
                  address.push(addressElement[prop]);
                }
              }
            }

            accumulator.push(
              Object.assign(
                { ...activity },
                {
                  accountData: customerRecord,
                  address: address.join(','),
                  AccountName: customerRecord.name,
                  todaysStockRequest: filtredSR
                }
              )
            );
          }
          return accumulator;
        },
        []
      );
      results = activityResult.sort(
        (activity1, activity2) => activity1.startdate > activity2.startdate
      );
    } catch (error) {
      console.log(error);
    }
  }
  return results;
};

const setFilterDate = (from, to, activityData) => {
  const activityList = getActivityListData(activityData, from, to);
  const customerList = getCustomerListData(activityList);
  const data = {
    activityList: activityList,
    customersList: customerList,
    from: from,
    to: to
  };
  return data;
};

const getActivityListData = (activityData, from, to) =>
  activityData.filter(item => {
    return (
      isAfter(from, formatDateMMDD(item.ActivityStartDate)) &&
      isBefore(to, formatDateMMDD(item.ActivityStartDate))
    );
  });

const getCustomerListData = activityList =>
  activityList.map(activity => {
    const accountCust = activity.accountData;
    return accountCust;
  });

export const getTodaysActivities = () => async dispatch => {
  dispatch({
    type: LOADING_TODAYS_ACTIVITIES,
    payload: true
  });

  const activities = await fetchAllActivitiesAndPopulateAccount();

  const filteredActivities = activities.filter(
    activity =>
      moment(activity.ActivityStartDate).isSameOrBefore(
        moment().endOf('day')
      ) &&
      moment(activity.ActivityStartDate).isSameOrAfter(moment().startOf('day'))
  );
  const todaysActivities = await geocodeAcitivities(filteredActivities);

  dispatch({
    type: TODAYS_ACTIVITIES,
    payload: {
      todaysActivities,
      updatedAt: new Date()
    }
  });

  dispatch({
    type: LOADING_TODAYS_ACTIVITIES,
    payload: false
  });
};

const geocodeAcitivities = async activityList => {
  if (
    activityList &&
    activityList.length > 0 &&
    activityList[0].accountData &&
    !activityList[0].accountData.location
  ) {
    return await Promise.all(
      activityList.map(async activity => {
        const account = activity.accountData;
        if (account && !account.location) {
          const address = `${account.AddressLine1}, ${
            account.City
          }, ${account.State || account.County}, ${account.Country}`;
          const geocodingResults = await fetch(
            `${google_maps_geocoding_api_endpoint}?address=${address}&key=${GOOGLE_MAPS_API_KEY}`
          );
          const geocodingResultsBody = await geocodingResults.json();
          const geocodedLatLng =
            geocodingResultsBody.results[0].geometry.location;
          const formattedLatLng = {
            latitude: geocodedLatLng.lat,
            longitude: geocodedLatLng.lng
          };
          return {
            ...activity,
            accountData: {
              ...activity.accountData,
              location: formattedLatLng
            }
          };
        } else {
          return activity;
        }
      })
    );
  } else {
    return activityList;
  }
};

export const notifyUserWhenNearActivity = (
  todaysActivities,
  deviceLocation,
  createNotification,
  distanceBetweenTwoPoints,
  navigation
) => (dispatch, getState) =>
  dispatch({
    type: TODAYS_ACTIVITIES,
    payload: {
      updatedAt: getState().customers.todaysActivitiesUpdatedAt,
      todaysActivities: todaysActivities.map(activity => {
        if (!activity.accountData.location.hasNotified) {
          if (
            distanceBetweenTwoPoints(
              deviceLocation,
              activity.accountData.location
            ) < 1000
          ) {
            createNotification(
              labels.IN_APP_NOTIFICATION_TITLE,
              labels.IN_APP_NOTIFICATION_MESSAGE(activity.AccountName),
              () => navigation.navigate(APP_ROUTE.ROUTE)
            );
            return {
              ...activity,
              accountData: {
                ...activity.accountData,
                location: {
                  ...activity.accountData.location,
                  hasNotified: true
                }
              }
            };
          }
        }

        return activity;
      })
    }
  });

export const getPromotions = () => {
  const data = promotionsData.items;
  return {
    type: GET_PROMOTIONS,
    payload: data
  };
};

export const resetCustomers = () => {
  return {
    type: RESET_CUSTOMERS
  };
};

export const reloadCustomer = isReload => {
  return {
    type: RELOAD_CUSTOMERS,
    payload: isReload
  };
};

export const reloadOrder = isReload => {
  return {
    type: RELOAD_ORDERS,
    payload: isReload
  };
};
