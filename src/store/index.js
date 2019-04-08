import {
  createStore as _createStore,
  applyMiddleware,
  combineReducers
} from 'redux';
import thunk from 'redux-thunk';
import { reducers, actions } from './modules';

/**
 * Root states types.
 */
export { States } from './modules';

// Apply thunk middleware
const middleware = applyMiddleware(thunk);

const appReducer = combineReducers({
  reducers
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
};

/**
 * Create app store.
 */
const createStore = (data = {}) =>
  _createStore(combineReducers(reducers), data, middleware);

export { createStore, actions };
