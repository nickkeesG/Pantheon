import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { BaseDaemonConfig, ChatDaemonConfig, InstructDaemonConfig } from './models';
import { defaultDaemonState } from '../daemons/daemonInstructions';


export interface DaemonState {
  chatDaemons: ChatDaemonConfig[];
  baseDaemon: BaseDaemonConfig;
  instructDaemon: InstructDaemonConfig;
}

const daemonSlice = createSlice({
  name: 'daemon',
  initialState: defaultDaemonState,
  reducers: {
    addChatDaemon(state, action: PayloadAction<ChatDaemonConfig>) {
      state.chatDaemons.push(action.payload);
    },
    removeChatDaemon(state, action: PayloadAction<number>) {
      state.chatDaemons = state.chatDaemons.filter(daemon => daemon.id !== action.payload);
    },
    updateChatDaemon(state, action: PayloadAction<ChatDaemonConfig>) {
      const index = state.chatDaemons.findIndex(daemon => daemon.id === action.payload.id);
      if (index !== -1) {
        state.chatDaemons[index] = {
          ...state.chatDaemons[index],
          ...action.payload
        };
      }
    },
    updateBaseDaemon(state, action: PayloadAction<BaseDaemonConfig>) {
      state.baseDaemon = {
        ...state.baseDaemon,
        ...action.payload
      };
    },
    resetDaemonSlice: (state) => defaultDaemonState
  },
});

export const selectEnabledChatDaemons = createSelector(
  [(state: RootState) => state.daemon.chatDaemons],
  (chatDaemons) => chatDaemons.filter(daemon => daemon.enabled)
);

export const { addChatDaemon, removeChatDaemon, updateChatDaemon, updateBaseDaemon, resetDaemonSlice } = daemonSlice.actions;
export default daemonSlice.reducer;