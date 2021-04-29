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
    yield put(fetchDataError({ message: error.message }));
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
    const feedback: Result<any> = yield k.saveNew(payload);
    if (feedback.success) {
      yield put(submitSuccess(undefined));
    } else {
      yield put(submitSuccess(feedback));
    }
  } catch (error) {
    yield put(submitError({ message: error.message }));
  }
}

function* putItem({ payload }: ModifyAction) {
  if (!(payload instanceof Array)) {
    payload = [payload];
  }
  try {
    let res: Result<any> = { success: true, statusText: "", data: {} };
    for (let p of payload) {
      res = yield k.save(p);
      if (!res.success) {
        yield k.refresh();
        break;
      }
    }
    yield put(submitSuccess(res.success ? undefined : res));
  } catch (error) {
    yield put(submitError({ message: error.message }));
  }
}

function* deleteItem({ payload }: EraseAction) {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }
  try {
    let res: Result<any> = { success: true, statusText: "", data: {} };
    for (let p of payload) {
      res = yield k.del(p);
      if (!res.success) {
        yield k.refresh();
        break;
      }
    }
    yield put(submitSuccess(undefined));
  } catch (error) {
    yield put(submitError({ message: error.message, data: error }));
  }
}

function* submitExcelData({ payload }: SubmitExcelAction) {
  let { selectedPlantId: pId } = yield select(getData);
  let { type, data } = payload;
  k.setPid(pId);
  let res: Result<any>[] = [];
  try {
    res = yield k.submitExcel(type, data);
  } catch (e) {
    yield put(submitError({ message: `${e}` }));
  }
  if (res.some((x) => !x.success)) {
    yield put(submitError({ message: "Some Error Occurred: See Log" }));
  } else {
    yield put(submitSuccess());
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
