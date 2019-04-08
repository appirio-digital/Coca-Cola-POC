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
import { CLEAR_STATE } from '../index';
import customer from './customer.json';

initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTOMERS:
      return {
        ...state,
        customersList: action.payload,
        loading: false
      };
    case GET_CUSTOMER_INVOICE:
      return {
        ...state,
        invoiceList: action.payload,
        loading: false
      };
    case GET_CUSTOMER_ORDER:
      return {
        ...state,
        orderList: action.payload,
        loading: false
      };
    case GET_ACTIVITY:
      return {
        ...state,
        activityList: action.payload.activityList,
        customersList: action.payload.customersList,
        fromDate: action.payload.from,
        toDate: action.payload.to,
        loading: false
      };
    case TODAYS_ACTIVITIES:
      return {
        ...state,
        todaysActivities: action.payload.todaysActivities,
        todaysActivitiesUpdatedAt: action.payload.updatedAt
      };
    case LOADING_TODAYS_ACTIVITIES:
      return {
        ...state,
        isTodaysActivitiesLoading: action.payload
      };
    case SET_DATE:
      return {
        ...state,
        ...action.payload
      };
    case GET_CUSTOMER_PAYMENT_HISTORY:
      return {
        ...state,
        paymentHistory: action.payload
      };
    case GET_CREDIT_NOTES:
      return {
        ...state,
        creditNotes: action.payload
      };
    case CUSTOMER_LOADING:
      return {
        ...state,
        loading: action.loading
      };
    case GET_CUSTOMERS_CONTACT:
      return {
        ...state,
        contact: action.payload
      };
    case GET_PROMOTIONS:
      return {
        ...state,
        promotions: action.payload
      };
    case RESET_CUSTOMERS: {
      return {
        customersList: []
      };
    }
    case RELOAD_CUSTOMERS: {
      return {
        isReloadCustomer: action.payload
      };
    }
    case RELOAD_ORDERS: {
      return {
        isReloadOrders: action.payload
      };
    }
    case CLEAR_STATE:
      state = [];
    default:
      return state;
  }
};
