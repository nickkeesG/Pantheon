import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';


export interface ErrorState {
  errors: string[];
}

const initialErrorState: ErrorState = {
  errors: []
};

const errorSlice = createSlice({
  name: 'error',
  initialState: initialErrorState,
  reducers: {
    addError(state, action: PayloadAction<string>) {
      state.errors.push(action.payload);
    },
    clearErrors(state) {
      state.errors = [];
    },
  },
});

export const { addError, clearErrors } = errorSlice.actions;
export default errorSlice.reducer;

// Selectors
export const selectLatestError = (state: RootState) => state.error.errors[state.error.errors.length - 1];

export const selectNumberOfErrors = (state: RootState) => state.error.errors.length;