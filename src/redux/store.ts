import { configureStore } from '@reduxjs/toolkit';
import textReducer from './textSlice';
import daemonReducer from './daemonSlice';

export const store = configureStore({
  reducer: {
    // TODO Break up textSlice into configSlice and ideas/comments slices
    text: textReducer,
    daemon: daemonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch