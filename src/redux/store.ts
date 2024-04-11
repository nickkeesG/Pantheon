import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import treeReducer from './treeSlice';
import sectionReducer from './sectionSlice';
import ideaReducer from './ideaSlice';
import commentReducer from './commentSlice';
import daemonReducer from './daemonSlice';
import configReducer from './configSlice';
import uiReducer from './uiSlice';
import errorReducer from './errorSlice';
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, createMigrate } from 'redux-persist';
import migrations from './migrations';


const persistConfig = {
  key: 'root',
  version: 0,
  storage,
  migrate: createMigrate(migrations, { debug: true })
};

const rootReducer = combineReducers({
  tree: treeReducer,
  section: sectionReducer,
  idea: ideaReducer,
  comment: commentReducer,
  daemon: daemonReducer,
  config: configReducer,
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
