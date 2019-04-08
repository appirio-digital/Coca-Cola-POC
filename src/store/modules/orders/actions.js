import { GET_ALL_ORDERS, GET_SELECTED_FILTER } from './types';

export const getAllOrders = () => ({
  type: GET_ALL_ORDERS
});

export const getSelectedFilter = filters => ({
  type: GET_SELECTED_FILTER,
  filters
});
