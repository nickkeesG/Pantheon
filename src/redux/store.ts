import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import textReducer from './textSlice';
import ideaReducer from './ideaSlice';
import commentReducer from './commentSlice';
import daemonReducer from './daemonSlice';
import llmReducer from './llmSlice';
import uiReducer from './uiSlice';
import errorReducer from './errorSlice';
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage
};

const rootReducer = combineReducers({
  text: textReducer,
  idea: ideaReducer,
  comment: commentReducer,
  daemon: daemonReducer,
  llm: llmReducer,
  ui: uiReducer,
  error: errorReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] // TODO I think we shouldn't have to ignore these but I'm not sure
      }
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof persistedReducer>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
