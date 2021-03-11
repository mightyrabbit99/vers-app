import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Data, ItemType } from "src/kernel";
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
    fetchDataError: (state, { payload }: PayloadAction<string>) => {
      state.syncing = false;
      state.error = payload;
    },
    syncing: (state) => {
      state.syncing = true;
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
      delete state.feedback;
    },
    modify: (state, { payload }: PayloadAction<Data | Data[]>) => {
      state.syncing = true;
      delete state.feedback;
    },
    erase: (state, { payload }: PayloadAction<Data | Data[]>) => {
      state.syncing = true;
    },
    submitExcel: (
      state,
      { payload }: PayloadAction<{ type: ItemType; data: any }>
    ) => {
      state.syncing = true;
    },
    clearFeedback: (state) => {
      state.feedback = undefined;
    },
  },
});

export const {
  fetchData,
  fetchDataSuccess,
  fetchDataError,
  syncing,
  submitSuccess,
  submitError,
  createNew,
  modify,
  erase,
  submitExcel,
  clearFeedback,
} = syncSlice.actions;

export default syncSlice.reducer;
