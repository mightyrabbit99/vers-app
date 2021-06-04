import { all, put, takeLatest } from "redux-saga/effects";
import { push } from 'connected-react-router'; 
import k, { Result, User } from "src/kernel";
import {
  initLogin,
  login,
  logout,
  loginSuccess,
  changeUserDetail,
  _setAuthenticated,
} from "src/slices/session";
import { fetchData } from "src/slices/sync";
import { EditUserAction, LoginAction } from "src/types";
import Path from "src/kernel/Path";

function* init() {
  if (k.isLoggedIn()) {
    let res: Result<User> = yield k.getUser();
    if (res.success) {
      yield put(fetchData());
      yield put(_setAuthenticated({ authenticated: true, user: res.data }));
      yield put(push(Path.PLANTS_PATH));
    } else {
      k.logout();
      yield put(_setAuthenticated({ authenticated: false }));
    }
  } else {
    yield put(_setAuthenticated({ authenticated: false }));
  }
}

function logoutThenUpdatePermission() {
  k.logout();
}

function* loginThenUpdatePermission({ payload }: LoginAction) {
  const feedback: Result<any> = yield k.login(payload.username, payload.password, payload.remember);
  if (feedback.success) {
    let res: Result<User> = yield k.getUser();
    yield put(_setAuthenticated({ authenticated: true, user: res.data }));
    yield put(loginSuccess(undefined));
    yield put(fetchData());
  } else {
    yield put(loginSuccess("Wrong Username/Password"));
  }
}

function* editUser({ payload }: EditUserAction) {
  const feedback: Result<any> = yield k.editUser(payload.username, payload.password);
  if (feedback.success) {
    yield put(_setAuthenticated({ authenticated: false }));
    yield put(loginSuccess(undefined));
    yield put(logout());
  } else {
    yield put(loginSuccess(feedback.data));
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
