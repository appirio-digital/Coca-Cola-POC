import { GET_ALL_TEMPLATES, GET_SELECTED_FILTER } from './types';
import { CLEAR_STATE } from '../index';
import sampleDataTemplates from './templateList.json';

export default (state = [], action) => {
  switch (action.type) {
    case GET_ALL_TEMPLATES:
      return { ...state, templates: sampleDataTemplates };
    case GET_SELECTED_FILTER:
      return { ...state, filters: action.filters };
    case CLEAR_STATE:
      state = [];
    default:
      return state;
  }
};
