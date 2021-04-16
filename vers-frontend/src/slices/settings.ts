import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsState } from "src/types";

export const initialState: SettingsState = {
  path: window.location.pathname,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setPath: (state, { payload }: PayloadAction<string>) => {
      state.path = payload;
    },
    submitSettings: (state, { payload }: PayloadAction<any>) => {

    },
  },
});

export const {
  submitSettings,
  setPath
} = settingsSlice.actions;

export default settingsSlice.reducer;
