import {
	type Action,
	configureStore,
	type ThunkAction,
} from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
	createMigrate,
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	persistReducer,
	persistStore,
	REGISTER,
	REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import commentReducer from "./commentSlice";
import configReducer from "./configSlice";
import daemonReducer from "./daemonSlice";
import errorReducer from "./errorSlice";
import ideaReducer from "./ideaSlice";
import migrations from "./migrations/migrations";
import sectionReducer from "./sectionSlice";
import treeReducer from "./treeSlice";
import uiReducer from "./uiSlice";

const persistConfig = {
	key: "root",
	version: Object.keys(migrations).length - 1,
	storage,
	migrate: createMigrate(migrations, { debug: true }),
};

export const rootReducer = combineReducers({
	tree: treeReducer,
	section: sectionReducer,
	idea: ideaReducer,
	comment: commentReducer,
	daemon: daemonReducer,
	config: configReducer,
	ui: uiReducer,
	error: errorReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // TODO I think we shouldn't have to ignore these but I'm not sure
			},
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof persistedReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
