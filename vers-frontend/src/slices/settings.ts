import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsState } from "src/types";

export const initialState: SettingsState = {

};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    submitSettings: (state, { payload }: PayloadAction<any>) => {

    },
  },
});

export const {
  submitSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;
