import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item, ItemType, Result } from "src/kernel";
import { MyError, SyncState } from "src/types";

export const initialState: SyncState = {
  syncing: false,
  fetching: false,
};

const syncSlice = createSlice({
  name: "sync",
  initialState,
  reducers: {
    fetchData: (state, { payload }: PayloadAction<undefined | ItemType | ItemType[]>) => {
      state.fetching = true;
    },
    fetchDataSuccess: (state) => {
      state.fetching = false;
    },
    fetchDataError: (state, { payload }: PayloadAction<undefined | MyError>) => {
      state.fetching = false;
      state.error = payload;
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
      delete state.feedback;
      delete state.error;
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
  submitExcel,
  clearFeedback,
} = syncSlice.actions;

export default syncSlice.reducer;
