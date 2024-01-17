import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';


export interface ErrorState {
  errors: string[];
  latestErrorTime?: number;
}

const initialErrorState: ErrorState = {
  errors: [],
  latestErrorTime: undefined,
};

const errorSlice = createSlice({
  name: 'error',
  initialState: initialErrorState,
  reducers: {
    addError(state, action: PayloadAction<string>) {
      state.errors.push(action.payload);
      state.latestErrorTime = Date.now();
    },
    clearErrors(state) {
      state.errors = [];
      state.latestErrorTime = undefined;
    },
  },
});

export const { addError, clearErrors } = errorSlice.actions;
export default errorSlice.reducer;

// Selectors
export const selectLatestError = (state: RootState) => state.error.errors[state.error.errors.length - 1];

export const selectNumberOfErrors = (state: RootState) => state.error.errors.length;