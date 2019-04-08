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
import { CLEAR_STATE } from '../index';

import sampleDataStockRequests from './stockRequestSampleList.json';
import sampleDataVanInventory from './vanInventory.json';
import sampleProducts from './products.json';

export default (state = [], action) => {
  switch (action.type) {
    case GET_ALL_STOCK_REQUESTS:
      return {
        ...state,
        stockRequests: action.payload,
        loading: action.loading
      };
    case GET_VAN_INVENTORY:
      return { ...state, vanInventory: sampleDataVanInventory };
    case GET_PRODUCT_FOR_STOCK_REQUESTS:
      return {
        ...state,
        selectedProducts: sampleProducts.slice(0, 4).map(product => {
          return { ...product, quantity: 0 };
        })
      };
    case SELECT_STOCK_REQUEST:
      return {
        ...state,
        selectedStockRequest: action.payload
      };
    case GET_ALL_PRODUCTS:
      return {
        ...state,
        allProducts: sampleProducts
      };
    case CREATE_NEW_STOCK_REQUEST:
      return {
        ...state,
        selectedProducts: [],
        selectedStockRequest: null
      };
    case INCREASE_PRODUCT_FOR_STOCK_REQUESTS:
      return {
        ...state,
        selectedProducts: state.selectedProducts.map(product => {
          let newQuantity =
            action.payload.ProductNumber === product.ProductNumber
              ? product.quantity + 1
              : product.quantity;
          return { ...product, quantity: newQuantity };
        })
      };
    case DELETE_PRODUCT_FOR_STOCK_REQUESTS:
      return {
        ...state,
        selectedProducts: state.selectedProducts.filter(product => {
          return product.ProductNumber !== action.payload.ProductNumber;
        })
      };
    case ADD_PRODUCT_FOR_STOCK_REQUESTS:
      let newLoad = {
        ...action.payload,
        quantity: 0
      };
      var selectedProducts = state.selectedProducts;
      if (selectedProducts) {
        selectedProducts.push(newLoad);
      } else {
        selectedProducts = [newLoad];
      }
      return {
        ...state,
        selectedProducts: selectedProducts
      };
    case DECREASE_PRODUCT_FOR_STOCK_REQUESTS:
      return {
        ...state,
        selectedProducts: state.selectedProducts.map(product => {
          let newQuantity =
            action.payload.ProductNumber === product.ProductNumber
              ? product.quantity - 1
              : product.quantity;
          return { ...product, quantity: newQuantity };
        })
      };
    case INCREASE_PRODUCT_FOR_VAN_INVENTORY:
      return {
        ...state,
        vanInventory: state.vanInventory.map(product => {
          let newQuantity =
            action.payload.id === product.id
              ? product.quantity + 1
              : product.quantity;
          return { ...product, quantity: newQuantity };
        })
      };
    case DECREASE_PRODUCT_FOR_VAN_INVENTORY:
      return {
        ...state,
        vanInventory: state.vanInventory.map(inventory => {
          let newQuantity =
            action.payload.id === inventory.id
              ? inventory.quantity - 1
              : inventory.quantity;
          return { ...inventory, quantity: newQuantity };
        })
      };
    case INSERT_PRODUCT_QUANTITY_FOR_VAN_INVENTORY:
      return {
        ...state,
        vanInventory: state.vanInventory.map(inventory => {
          let newQuantity =
            action.payload.selectedItem.id === inventory.id
              ? Number.isNaN(parseInt(action.payload.quantity))
                ? 0
                : parseInt(action.payload.quantity)
              : inventory.quantity;
          return { ...inventory, quantity: newQuantity };
        })
      };

    case INSERT_PRODUCT_QUANTITY_FOR_STOCK_REQUESTS:
      return {
        ...state,
        selectedProducts: state.selectedProducts.map(product => {
          let newQuantity =
            action.payload.selectedItem.ProductNumber === product.ProductNumber
              ? Number.isNaN(parseInt(action.payload.quantity))
                ? 0
                : parseInt(action.payload.quantity)
              : product.quantity;
          return { ...product, quantity: newQuantity };
        })
      };
    case GET_ROUTE_ALLOCATION:
      return {
        ...state,
        routeAllocation: action.payload
      };
    case CLEAR_STATE:
      state = [];
    default:
      return state;
  }
};
