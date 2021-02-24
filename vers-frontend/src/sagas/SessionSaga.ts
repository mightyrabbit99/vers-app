import { all, put, takeLatest } from "redux-saga/effects";
import k, { Result } from "src/kernel";
import {
  initLogin,
  login,
  logout,
  loginSuccess,
  changeUserDetail,
  _setAuthenticated,
} from "src/slices/session";
import { EditUserAction, LoginAction } from "src/types";

function* init() {
  if (k.isLoggedIn()) {
    let res: any = yield k.getUser();
    if (res.success) {
      yield put(_setAuthenticated({ authenticated: true, user: res.data }));
    } else {
      k.logout();
      yield put(_setAuthenticated({ authenticated: false }));
    }
  } else {
    yield put(_setAuthenticated({ authenticated: false }));
  }
}

function* logoutThenUpdatePermission() {
  k.logout();
}

function* loginThenUpdatePermission({ payload }: LoginAction) {
  const feedback: Result = yield k.login(payload.username, payload.password);
  console.log(feedback);
  if (feedback.success) {
    let res: any = yield k.getUser();
    console.log(res);
    yield put(_setAuthenticated({ authenticated: true, user: res.data }));
    yield put(loginSuccess(undefined));
  } else {
    yield put(loginSuccess("Wrong Username/Password"));
  }
}

function* editUser({ payload }: EditUserAction) {
  const feedback: Result = yield k.editUser(payload.username, payload.password);
  console.log(feedback);
  if (feedback.success) {
    yield put(_setAuthenticated({ authenticated: false }));
    yield put(loginSuccess(undefined));
  } else {
    yield put(loginSuccess("changes failed"));
  }
}

function* sessionSaga() {
  yield all([
    takeLatest(login.type, loginThenUpdatePermission),
    takeLatest(logout.type, logoutThenUpdatePermission),
    takeLatest(changeUserDetail.type, editUser),
    takeLatest(initLogin.type, init),
  ]);
}

export default sessionSaga;
