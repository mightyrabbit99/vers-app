import { all, put, select, takeLatest } from "redux-saga/effects";
import k, { Result } from "src/kernel";
import { getData } from "src/selectors";
import { reload, selPlant } from "src/slices/data";
import {
  createNew,
  erase,
  modify,
  fetchData,
  fetchDataError,
  fetchDataSuccess,
  submitExcel,
  submitError,
  submitSuccess,
} from "src/slices/sync";
import {
  FetchDataAction,
  CreateNewAction,
  EraseAction,
  ModifyAction,
  SubmitExcelAction,
} from "src/types";

function* fetchDatas({ payload }: FetchDataAction) {
  try {
    yield k.refresh(payload);
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
      yield put(submitSuccess(undefined));
      //yield put(_saveData(payload));
    } else {
      yield put(submitSuccess(feedback.data));
    }
  } catch (error) {
    yield put(submitError(error.message));
  }
}

function* putItem({ payload }: ModifyAction) {
  if (!(payload instanceof Array)) {
    payload = [payload];
  }
  try {
    let res: Result = { success: true, statusText: "", data: {} };
    for (let p of payload) {
      res = yield k.save(p);
      if (!res.success) {
        yield k.refresh();
        yield put(reload());
        break;
      }
    }
    yield put(submitSuccess(res.success ? undefined : res.data));
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
    yield k.refresh();
    yield put(reload());
    yield put(submitSuccess(undefined));
  } catch (error) {
    yield put(submitError({ message: error.message, data: error }));
  }
}

function* submitExcelData({ payload }: SubmitExcelAction) {
  let { selectedPlantId: pId } = yield select(getData);
  let { type, data } = payload;
  let res: Result[] = yield k.submitExcel(pId, type, data);
  if (res.some((x) => !x.success)) {
    yield put(submitError({ message: "Some Error Occurred: See Log" }));
  }
}

function* syncSaga() {
  yield all([
    takeLatest(fetchData.type, fetchDatas),
    takeLatest(createNew.type, postItemThenSave),
    takeLatest(modify.type, putItem),
    takeLatest(erase.type, deleteItem),
    takeLatest(submitExcel.type, submitExcelData),
  ]);
}

export default syncSaga;
