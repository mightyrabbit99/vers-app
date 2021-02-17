import { RootState } from "src/types";

export const getData = (state: RootState) => state.dataState;
export const getSync = (state: RootState) => state.syncState;
export const getSettings = (state: RootState) => state.settingsState;
export const getSession = (state: RootState) => state.sessionState;
