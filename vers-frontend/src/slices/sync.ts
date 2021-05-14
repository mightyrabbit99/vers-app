import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item, Feedback, ItemType, Result } from "src/kernel";
import { MyError, SyncState, SubmitExcelAction, CreateNewAction, ModifyAction, EraseAction } from "src/types";

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
    submitSuccess: (state, { payload }: PayloadAction<Result<Feedback<Item>> | undefined>) => {
      state.syncing = false;
      state.feedback = payload?.data;
    },
    createNew: (state, { payload }: PayloadAction<CreateNewAction["payload"]>) => {
      state.syncing = true;
      delete state.feedback;
    },
    modify: (state, { payload }: PayloadAction<ModifyAction["payload"]>) => {
      state.syncing = true;
      delete state.feedback;
    },
    erase: (state, { payload }: PayloadAction<EraseAction["payload"]>) => {
      state.syncing = true;
    },
    submitExcel: (
      state,
      { payload }: PayloadAction<SubmitExcelAction["payload"]>
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
