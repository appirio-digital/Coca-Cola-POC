import {
  GET_ALL_PRODUCTS,
  GET_SELECTED_FILTER,
  GET_PRODUCTS_CATEGORY,
  GET_PRODUCTS_CATEGORY_MAPPING,
  PRODUCT_LOADING,
  PRICE_BOOK_ITEMS,
  GET_ALL_PRODUCTS_WITH_PRICE,
  SET_PRICE_BOOK_HEADER,
  GET_SLOT_MACHINE_LIST,
  SET_SLOT_MACHINE_BALANCE
} from './types';
import { CLEAR_STATE } from '../index';

export default (state = [], action) => {
  switch (action.type) {
    case PRICE_BOOK_ITEMS:
      return { ...state, priceBookItem: action.priceBookItem };
    case GET_ALL_PRODUCTS:
      return { ...state, products: action.products, loading: false };
    case GET_PRODUCTS_CATEGORY:
      return { ...state, category: action.payload };
    case GET_PRODUCTS_CATEGORY_MAPPING:
      return { ...state, mapping: action.payload };
    case GET_SELECTED_FILTER:
      return { ...state, filters: action.filters };
    case GET_ALL_PRODUCTS_WITH_PRICE:
      return { ...state, pricedProducts: action.products, loading: false };
    case PRODUCT_LOADING:
      return {
        ...state,
        loading: action.loading
      };

    case SET_PRICE_BOOK_HEADER:
      return {
        ...state,
        priceBookHeader: action.payload
      };
    case GET_SLOT_MACHINE_LIST:
      return {
        ...state,
        slotsmschinelist: action.payload
      };
    case CLEAR_STATE:
      state = [];
    default:
      return state;
  }
};
