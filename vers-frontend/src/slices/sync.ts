import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Data } from "src/kernel";
import { SyncState } from "src/types";

export const initialState: SyncState = {
  syncing: false,
};

const syncSlice = createSlice({
  name: "sync",
  initialState,
  reducers: {
    fetchData: (state) => {
      state.syncing = true;
    },
    fetchDataSuccess: (state) => {
      state.syncing = false;
    },
    fetchDataError: (state) => {
      state.syncing = false;
    },
    submitError: (state, { payload }: PayloadAction<string>) => {
      state.syncing = false;
      state.error = payload;
    },
    submitSuccess: (state, { payload }: PayloadAction<any>) => {
      state.syncing = false;
      state.feedback = payload;
    },
    createNew: (state, { payload }: PayloadAction<Data>) => {
      state.syncing = true;
      state.feedback = undefined;
    },
    modify: (state, { payload }: PayloadAction<Data | Data[]>) => {
      state.syncing = true;
    },
    erase: (state, { payload }: PayloadAction<Data | Data[]>) => {
      state.syncing = true;
    },
  },
});

export const {
  fetchData,
  fetchDataSuccess,
  fetchDataError,
  submitSuccess,
  submitError,
  createNew,
  modify,
  erase,
} = syncSlice.actions;

export default syncSlice.reducer;
