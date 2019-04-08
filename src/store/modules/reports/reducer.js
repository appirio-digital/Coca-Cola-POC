import { GET_ALL_REPORTS, GENERATE_FILTERED_REPORTS } from './types';
import { CLEAR_STATE } from '../index';

export default (state = [], action) => {
  switch (action.type) {
    case GET_ALL_REPORTS:
      return { ...state, paymentslist: action.payload };
    case GENERATE_FILTERED_REPORTS:
      return { ...state, summaryList: action.payload };
    case CLEAR_STATE:
      state = [];
    default:
      return state;
  }
};
