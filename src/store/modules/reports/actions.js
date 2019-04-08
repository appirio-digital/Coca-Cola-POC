import { GET_ALL_REPORTS, GENERATE_FILTERED_REPORTS } from './types';
import paymentslist from './reports.json';

export const getAllReports = () => ({
  type: GET_ALL_REPORTS,
  payload: paymentslist
});

export const getFilteredReprots = reportList => ({
  type: GENERATE_FILTERED_REPORTS,
  payload: reportList
});
