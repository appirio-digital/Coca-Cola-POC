import { auth } from './login';
import { customers } from './customers';
import { stock } from './stock';
import { product } from './products';
import { orders } from './orders';
import { dashboard } from './dashboard';
import { locations } from './location';
import { reports } from './reports';
import { performance } from './performance';
import { templates } from './templates';
import { sync } from './sync';

/**
 * Root reducers.
 */

export const CLEAR_STATE = 'clear_state';

export const reducers = {
  auth: auth.reducer,
  customers: customers.reducer,
  stock: stock.reducer,
  dashboard: dashboard.reducer,
  product: product.reducer,
  reports: reports.reducer,
  locations: locations.reducer,
  performance: performance.reducer,
  orders: orders.reducer,
  templates: templates.reducer,
  sync: sync.reducer
};

/**
 * Root actions.
 */
export const actions = {
  auth: auth.actions,
  dashboard: dashboard.actions,
  customers: customers.actions,
  stock: stock.actions,
  locations: locations.actions,
  reports: reports.actions,
  product: product.actions,
  performance: performance.actions,
  orders: orders.actions,
  templates: templates.actions,
  sync: sync.actions
};
export {
  auth,
  dashboard,
  customers,
  stock,
  product,
  locations,
  reports,
  performance,
  orders,
  sync
};
