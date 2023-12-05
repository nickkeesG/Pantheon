import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TextState {
  openaiKey: string;
  atoms: string[];
}

const initialState: TextState = {
  openaiKey: '',
  atoms: [],
};

const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    setOpenaiKey(state, action: PayloadAction<string>) {
      state.openaiKey = action.payload;
    },
    addString(state, action: PayloadAction<string>) {
      state.atoms.push(action.payload);
    },
    // Potentially more reducers here
  },
});

export const { setOpenaiKey, addString } = textSlice.actions;
export default textSlice.reducer;
