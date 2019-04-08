import { UPDATE_IS_SYNCING } from './types';

const INITIAL_STATE = {
  isSyncing: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_IS_SYNCING:
      return {
        ...state,
        isSyncing: action.payload,
      };
    default:
      return state;
  }
};
