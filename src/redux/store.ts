import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import textReducer from './textSlice';
import daemonReducer from './daemonSlice';
import llmReducer from './llmSlice';
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['text']
};

const rootReducer = combineReducers({
  text: textReducer,
  daemon: daemonReducer,
  llm: llmReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof persistedReducer>
export type AppDispatch = typeof store.dispatch