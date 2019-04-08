import { GET_ALL_TEMPLATES, GET_SELECTED_FILTER } from './types';

export const getAllTemplates = () => ({
  type: GET_ALL_TEMPLATES
});

export const getSelectedFilter = filters => ({
  type: GET_SELECTED_FILTER,
  filters
});
