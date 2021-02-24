import { all, put, takeLatest } from "redux-saga/effects";
import k, { Result } from "src/kernel";

import { calculate, _reload, reload, _saveData, selPlant } from "src/slices/data";
import {
  createNew,
  modify,
  erase,
  submitError,
  submitSuccess,
  fetchData,
  fetchDataError,
  fetchDataSuccess,
} from "src/slices/sync";
import { CreateNewAction, EraseAction, ModifyAction } from "src/types";

function* fetchDatas() {
  try {
    yield k.refresh();
  } catch (error) {
    yield put(fetchDataError(error.message));
    return;
  }
  yield put(fetchDataSuccess());
  let lPstr = localStorage.getItem("lastPlant");
  let lP = lPstr ? parseInt(lPstr, 10) : undefined;
  if (!((lPstr ?? "") in k.plantStore.getLst())) {
    lP = undefined;
    localStorage.removeItem("lastPlant");
  }
  yield lP ? put(selPlant(lP)) : put(reload());
}

function* postItemThenSave({ payload }: CreateNewAction) {
  try {
    const feedback: Result = yield k.saveNew(payload);
    if (feedback.success) {
      yield put(_saveData(feedback.data));
      yield put(submitSuccess(undefined));
    } else {
      yield put(submitSuccess(feedback.data));
    }
  } catch (error) {
    yield put(submitError(error.message));
  }
  yield put(calculate());
}

function* putItem({ payload }: ModifyAction) {
  if (!(payload instanceof Array)) {
    payload = [payload];
  }
  try {
    for (let p of payload) {
      yield k.save(p);
    }
    yield put(submitSuccess(undefined));
  } catch (error) {
    yield put(submitError(error.message));
  }
}

function* deleteItem({ payload }: EraseAction) {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }
  try {
    for (let p of payload) {
      yield k.del(p);
    }
    yield put(submitSuccess(undefined));
  } catch (error) {
    yield put(submitError(error.message));
  }
}

function* syncSaga() {
  yield all([
    takeLatest(fetchData.type, fetchDatas),
    takeLatest(createNew.type, postItemThenSave),
    takeLatest(modify.type, putItem),
    takeLatest(erase.type, deleteItem),
  ]);
}

export default syncSaga;
