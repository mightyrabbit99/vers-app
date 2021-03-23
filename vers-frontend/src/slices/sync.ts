import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item, ItemType, Result } from "src/kernel";
import { MyError, SyncState } from "src/types";

export const initialState: SyncState = {
  syncing: false,
};

const syncSlice = createSlice({
  name: "sync",
  initialState,
  reducers: {
    fetchData: (state, { payload }: PayloadAction<undefined | ItemType | ItemType[]>) => {
      state.syncing = true;
    },
    fetchDataSuccess: (state) => {
      state.syncing = false;
    },
    fetchDataError: (state, { payload }: PayloadAction<undefined | MyError>) => {
      state.syncing = false;
      state.error = payload;
    },
    syncing: (state) => {
      state.syncing = true;
    },
    submitError: (state, { payload }: PayloadAction<undefined | MyError>) => {
      state.syncing = false;
      state.error = payload;
    },
    submitSuccess: (state, { payload }: PayloadAction<Result | undefined>) => {
      state.syncing = false;
      state.feedback = payload?.data;
    },
    createNew: (state, { payload }: PayloadAction<Item>) => {
      state.syncing = true;
      delete state.feedback;
    },
    modify: (state, { payload }: PayloadAction<Item | Item[]>) => {
      state.syncing = true;
      delete state.feedback;
    },
    erase: (state, { payload }: PayloadAction<Item | Item[]>) => {
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
