import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Daemon {
  id: number;
  name: string;
  status: string;
}

export interface DaemonState {
  daemons: Daemon[];
}

const initialDaemonState: DaemonState = {
  daemons: []
};

const daemonSlice = createSlice({
  name: 'daemon',
  initialState: initialDaemonState,
  reducers: {
    addDaemon(state, action: PayloadAction<Daemon>) {
      state.daemons.push(action.payload);
    },
    removeDaemon(state, action: PayloadAction<number>) {
      state.daemons = state.daemons.filter(daemon => daemon.id !== action.payload);
    },
    updateDaemonStatus(state, action: PayloadAction<{ id: number; status: string }>) {
      const index = state.daemons.findIndex(daemon => daemon.id === action.payload.id);
      if (index !== -1) {
        state.daemons[index].status = action.payload.status;
      }
    },
    // Add more reducers as needed for your application
  },
});

export const { addDaemon, removeDaemon, updateDaemonStatus } = daemonSlice.actions;

export default daemonSlice.reducer;