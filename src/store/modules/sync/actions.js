import { UPDATE_IS_SYNCING } from './types';

export const updateIsDataSyncing = isSyncing => ({
  type: UPDATE_IS_SYNCING,
  payload: isSyncing
})