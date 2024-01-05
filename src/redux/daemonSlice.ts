import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { BaseDaemonConfig, ChatDaemonConfig } from './models';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorageUtils';
import { defaultDaemonState } from '../daemons/daemonInstructions';


const DAEMON_STATE_KEY = 'daemonState';

export interface DaemonState {
  chatDaemons: ChatDaemonConfig[];
  baseDaemon: BaseDaemonConfig;
}

const daemonSlice = createSlice({
  name: 'daemon',
  initialState: loadFromLocalStorage(DAEMON_STATE_KEY, defaultDaemonState) as DaemonState,
  reducers: {
    addChatDaemon(state, action: PayloadAction<ChatDaemonConfig>) {
      state.chatDaemons.push(action.payload);
      saveToLocalStorage(DAEMON_STATE_KEY, state);
    },
    removeChatDaemon(state, action: PayloadAction<number>) {
      state.chatDaemons = state.chatDaemons.filter(daemon => daemon.id !== action.payload);
      saveToLocalStorage(DAEMON_STATE_KEY, state);
    },
    updateChatDaemon(state, action: PayloadAction<ChatDaemonConfig>) {
      const index = state.chatDaemons.findIndex(daemon => daemon.id === action.payload.id);
      if (index !== -1) {
        state.chatDaemons[index] = {
          ...state.chatDaemons[index],
          ...action.payload
        };
        saveToLocalStorage(DAEMON_STATE_KEY, state);
      }
    },
    updateBaseDaemon(state, action: PayloadAction<BaseDaemonConfig>) {
      state.baseDaemon = {
        ...state.baseDaemon,
        ...action.payload
      };
      saveToLocalStorage(DAEMON_STATE_KEY, state);
    },
    resetDaemonState(state) {
      Object.assign(state, defaultDaemonState);
      saveToLocalStorage(DAEMON_STATE_KEY, state);
    }
  },
});

export const selectEnabledChatDaemons = createSelector(
  [(state: RootState) => state.daemon.chatDaemons],
  (chatDaemons) => chatDaemons.filter(daemon => daemon.enabled)
);

export const { addChatDaemon, removeChatDaemon, updateChatDaemon, updateBaseDaemon, resetDaemonState } = daemonSlice.actions;
export default daemonSlice.reducer;