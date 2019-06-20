import {
  GET_ALL_PRODUCTS,
  GET_SELECTED_FILTER,
  PRODUCT_LOADING,
  GET_PRODUCTS_CATEGORY,
  GET_PRODUCTS_CATEGORY_MAPPING,
  PRICE_BOOK_ITEMS,
  GET_ALL_PRODUCTS_WITH_PRICE,
  SET_PRICE_BOOK_HEADER,
  GET_SLOT_MACHINE_LIST,
  SET_SLOT_MACHINE_BALANCE
} from './types';

import {
  fetchObjectCollection,
  API_END_POINT,
  API_NAME,
  loadDataForEntity,
  fetchObjectWithFilter,
  OPRATIONS
} from '../../../services/omcClient';

import { find, findIndex, isEmpty } from 'lodash';
import slotMachine from './slotMachine.json';

export const getSlotMachinelists = () => {
  return slotMachine;
};

export const setSlotMachinelists = () => {
  return slotMachine;
};

export const getPriceBookItems = country => async dispatch => {
  try {
    const API = API_END_POINT.PRICE_BOOK + country;
    const priceBookHeader = await fetchObjectCollection(API_NAME, API);
    if (priceBookHeader) {
      dispatch({
        type: SET_PRICE_BOOK_HEADER,
        payload: priceBookHeader[0]
      });
      const priceBookItem = await fetchObjectCollection(
        API_NAME,
        '/priceBookItemId?priceBookId=' + priceBookHeader[0].PricebookId
      );
      return priceBookItem;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllProducts = () => async dispatch => {
  dispatch({
    type: PRODUCT_LOADING,
    loading: true
  });

  try {
    const mapping = await fetchObjectCollection(
      API_NAME,
      API_END_POINT.PRODUCT_CATEGORY_MAPPING
    );

    const category = await fetchObjectCollection(
      API_NAME,
      API_END_POINT.PRODUCT_CATEGORY
    );

    const response = await fetchObjectCollection(
      API_NAME,
      API_END_POINT.PRODUCT
    );

    const products = [...response].map(product => {
      const productMapping = find([...mapping], map => {
        return map.InventoryItemId == product.InventoryItemId;
      });

      const categoryName = productMapping
        ? find([...category], cat => {
            return cat.ProdGroupId == productMapping.ProdGroupId;
          })
        : '';

      product = Object.assign({}, product, {
        category: categoryName ? categoryName : {},
        ProdGroup: productMapping
      });
      return product;
    });

    dispatch({
      type: GET_ALL_PRODUCTS,
      products: products,
      loading: false
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: PRODUCT_LOADING,
      loading: false
    });
  }
};

export const getAllProductsWithPrice = priceBookItem => async dispatch => {
  dispatch({
    type: PRODUCT_LOADING,
    loading: true
  });

  let filteredInventoryProduct = [];

  try {
    const mapping = await fetchObjectCollection(
      API_NAME,
      API_END_POINT.PRODUCT_CATEGORY_MAPPING
    );

    const category = await fetchObjectCollection(
      API_NAME,
      API_END_POINT.PRODUCT_CATEGORY
    );

    const response = await fetchObjectCollection(
      API_NAME,
      API_END_POINT.PRODUCT
    );

    // const routeAllocation = await fetchObjectCollection(
    //   API_NAME,
    //   API_END_POINT.ROUTE_ALLOCATION
    // );
    // if (routeAllocation) {
    //   const inventory = await fetchObjectCollection(
    //     API_NAME,
    //     API_END_POINT.ROUTE_INVENTORY
    //   );
    //   filteredInventoryProduct = inventory.filter(
    //     inventoryProduct =>
    //       inventoryProduct.__ORACO__Route_Id_c ===
    //       routeAllocation[0].__ORACO__Route_Id_c
    //   );
    // }

    const products = [...response].map(product => {
      const productMapping = find([...mapping], map => {
        return map.InventoryItemId == product.InventoryItemId;
      });

      const categoryName = productMapping
        ? find([...category], cat => {
            return cat.ProdGroupId == productMapping.ProdGroupId;
          })
        : '';

      product = Object.assign({}, product, {
        category: categoryName ? categoryName : {},
        ProdGroup: productMapping
      });
      return product;
    });

    const list = [...products].filter(
      item =>
        findIndex(
          priceBookItem,
          priceBook => priceBook.InvItemId == item.InventoryItemId
        ) !== -1
      // &&
      // (!isEmpty[filteredInventoryProduct] &&
      //   findIndex(
      //     filteredInventoryProduct,
      //     inventory => inventory.__ORACO__Product_Id_c == item.InventoryItemId
      //   ) !== -1)
    );

    dispatch({
      type: GET_ALL_PRODUCTS_WITH_PRICE,
      products: list,
      loading: false
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: PRODUCT_LOADING,
      loading: false
    });
  }
};

export const getAllProductCategory = () => dispatch => {
  dispatch({
    type: PRODUCT_LOADING,
    loading: true
  });
  const request = async () => {
    try {
      const response = await fetchObjectCollection(
        API_NAME,
        API_END_POINT.PRODUCT_CATEGORY
      );

      dispatch({
        type: GET_PRODUCTS_CATEGORY,
        payload: response,
        loading: false
      });
    } catch (error) {
      console.log(error);
    }
  };
  request();
};

// export const getProductGroupProductSetup = () => dispatch => {
//   dispatch({
//     type: PRODUCT_LOADING,
//     loading: true
//   });
//   const request = async () => {
//     try {
//       const response = await fetchObjectCollection(
//         API_NAME,
//         API_END_POINT.PRODUCT_CATEGORY_MAPPING
//       );

//       dispatch({
//         type: GET_PRODUCTS_CATEGORY_MAPPING,
//         payload: response,
//         loading: false
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   request();
// };

export const getSelectedFilter = filters => ({
  type: GET_SELECTED_FILTER,
  filters
});
