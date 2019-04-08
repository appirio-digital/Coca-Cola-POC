import moment from 'moment';
import {
  UPDATE_FILTERED_CHARTS_DATA,
  UPDATE_CURRENT_CHART,
  UPDATE_FILTER_CRITERIA,
  UPDATE_ORDERS_EXECUTED_CHART_LOADING,
  UPDATE_PRODUCTS_SOLD_CHART_LOADING,
} from './types';
import { CLEAR_STATE } from '../index';

const INITIAL_STATE = {
  filteredCharts: [],
  selectedChart: null,
  filterCriteria: {
    from: moment()
      .startOf('day')
      .toDate(),
    to: moment()
      .endOf('day')
      .toDate(),
    filter: {
      type: null,
      value: null
    }
  },
  isOrdersExecutedChartLoading: false,
  isProductsSoldChartLoading: false,
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case UPDATE_FILTERED_CHARTS_DATA:
      return {
        ...state,
        filteredCharts: payload
      };

    case UPDATE_CURRENT_CHART:
      return {
        ...state,
        selectedChart: payload
      };

    case UPDATE_FILTER_CRITERIA:
      return {
        ...state,
        filterCriteria: payload
      };
    case UPDATE_ORDERS_EXECUTED_CHART_LOADING:
      return {
        ...state,
        isOrdersExecutedChartLoading: payload
      };

    case UPDATE_PRODUCTS_SOLD_CHART_LOADING:
      return {
        ...state,
        isProductsSoldChartLoading: payload
      };

    case CLEAR_STATE:
      return {
        ...state,
        filteredCharts: [],
        selectedChart: null,
      };
    default:
      return state;
  }
};
