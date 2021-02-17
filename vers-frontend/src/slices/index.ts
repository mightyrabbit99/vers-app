import { combineReducers, Reducer } from "redux";

import dataReducer from "src/slices/data";
import syncReducer from "src/slices/sync";
import settingsReducer from "src/slices/settings";
import sessionReducer from "src/slices/session";
import { RootState } from "src/types";

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  dataState: dataReducer,
  syncState: syncReducer,
  settingsState: settingsReducer,
  sessionState: sessionReducer,
});

export default rootReducer;
