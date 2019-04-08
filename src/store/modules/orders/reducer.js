import { GET_ALL_ORDERS, GET_SELECTED_FILTER } from './types';
import { CLEAR_STATE } from '../index';
import sampleDataOrders from './orderList.json';

export default (state = [], action) => {
  switch (action.type) {
    case GET_ALL_ORDERS:
      return { ...state, orders: sampleDataOrders };
    case GET_SELECTED_FILTER:
      return { ...state, filters: action.filters };
    case CLEAR_STATE:
      state = [];
    default:
      return state;
  }
};
