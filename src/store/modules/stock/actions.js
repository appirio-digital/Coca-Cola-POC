import {
  GET_ALL_STOCK_REQUESTS,
  GET_VAN_INVENTORY,
  GET_PRODUCT_FOR_STOCK_REQUESTS,
  INCREASE_PRODUCT_FOR_STOCK_REQUESTS,
  DECREASE_PRODUCT_FOR_STOCK_REQUESTS,
  CREATE_NEW_STOCK_REQUEST,
  SELECT_STOCK_REQUEST,
  DELETE_PRODUCT_FOR_STOCK_REQUESTS,
  ADD_PRODUCT_FOR_STOCK_REQUESTS,
  GET_ALL_PRODUCTS,
  INCREASE_PRODUCT_FOR_VAN_INVENTORY,
  DECREASE_PRODUCT_FOR_VAN_INVENTORY,
  INSERT_PRODUCT_QUANTITY_FOR_VAN_INVENTORY,
  INSERT_PRODUCT_QUANTITY_FOR_STOCK_REQUESTS,
  GET_ROUTE_ALLOCATION
} from './types';

import {
  API_END_POINT,
  API_NAME,
  fetchObjectCollection,
  JTI_API
} from '../../../services/omcClient';

export const getAllStockRequest = () => async dispatch => {
  try {
    const response = await fetchObjectCollection(
      JTI_API,
      API_END_POINT.ACTIVITY
    );
    const filteredStockRequest = response.filter(
      activity =>
        activity.function === 'TASK' && activity.subtype === 'STOCK_REQUEST'
    );
    dispatch({
      type: GET_ALL_STOCK_REQUESTS,
      payload: filteredStockRequest,
      loading: false
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_STOCK_REQUESTS,
      loading: false
    });
    console.log('error while fetching stock request', error);
  }
};

export const getSelectedProductsForStockRequest = stockRequest => ({
  type: GET_PRODUCT_FOR_STOCK_REQUESTS,
  payload: stockRequest
});

export const getAllProducts = () => ({
  type: GET_ALL_PRODUCTS
});

export const selectStockRequest = stockRequest => ({
  type: SELECT_STOCK_REQUEST,
  payload: stockRequest
});

export const increaseProductsQuantityForStockRequest = item => ({
  type: INCREASE_PRODUCT_FOR_STOCK_REQUESTS,
  payload: item
});

export const decreaseProductsQuantityForStockRequest = item => ({
  type: DECREASE_PRODUCT_FOR_STOCK_REQUESTS,
  payload: item
});

export const addProductForStockRequest = item => ({
  type: ADD_PRODUCT_FOR_STOCK_REQUESTS,
  payload: item
});

export const deleteProductForStockRequest = item => ({
  type: DELETE_PRODUCT_FOR_STOCK_REQUESTS,
  payload: item
});

export const createNewStockRequest = () => ({
  type: CREATE_NEW_STOCK_REQUEST
});

export const getRouteAllocation = () => async dispatch => {
  try {
    const response = await fetchObjectCollection(
      API_NAME,
      API_END_POINT.ROUTE_ALLOCATION
    );
    dispatch({
      type: GET_ROUTE_ALLOCATION,
      payload: response
    });
  } catch (error) {
    console.log(error);
  }
};

export const getVanInventory = () => ({
  type: GET_VAN_INVENTORY
});

export const increaseProductsQuantityForVanInventory = item => ({
  type: INCREASE_PRODUCT_FOR_VAN_INVENTORY,
  payload: item
});

export const decreaseProductsQuantityForVanInventory = item => ({
  type: DECREASE_PRODUCT_FOR_VAN_INVENTORY,
  payload: item
});

export const insertProductsQuantityForVanInventory = (text, item) => {
  const payloadDictionary = { quantity: text, selectedItem: item };
  return {
    type: INSERT_PRODUCT_QUANTITY_FOR_VAN_INVENTORY,
    payload: payloadDictionary
  };
};

export const insertProductsQuantityForStockRequest = (text, item) => {
  const payloadDictionary = { quantity: text, selectedItem: item };
  return {
    type: INSERT_PRODUCT_QUANTITY_FOR_STOCK_REQUESTS,
    payload: payloadDictionary
  };
};
