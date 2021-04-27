import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SessionState } from "src/types";

export const initialState: SessionState = {
  syncing: false,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    _setAuthenticated: (state, { payload }: PayloadAction<any>) => {
      if (payload.authenticated) {
        state.authenticated = true;
        state.user = payload.user;
      } else {
        state.authenticated = false;
      }
    },
    initLogin: (state) => {},
    login: (state, { payload }: PayloadAction<any>) => {
      state.syncing = true;
      state.authenticated = undefined;
    },
    loginSuccess: (state, { payload }: PayloadAction<any>) => {
      state.syncing = false;
      state.feedback = payload;
    },
    loginFailed: (state) => {
      state.syncing = false;
      state.error = "Fuck";
    },
    logout: (state) => {
      state.authenticated = false;
    },
    changeUserDetail: (state, { payload }: PayloadAction<any>) => {
      state.syncing = true;
    },
    clearFeedback: (state) => {
      state.feedback = undefined;
    },
  },
});

export const {
  initLogin,
  login,
  loginSuccess,
  loginFailed,
  _setAuthenticated,
  logout,
  changeUserDetail,
  clearFeedback,
} = sessionSlice.actions;

export default sessionSlice.reducer;
