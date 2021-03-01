import { all, put, select, takeLatest } from "redux-saga/effects";
import k, { Result } from "src/kernel";
import { getData } from "src/selectors";
import { calculate, reload, selPlant, _saveData } from "src/slices/data";
import {
  createNew,
  erase,
  modify,
  fetchData,
  fetchDataError,
  fetchDataSuccess,
  submitExcel,
  submitError,
  submitSuccess
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

function* submitExcelData({ payload }: any) {
  let { selectedPlantId: pId } = yield select(getData);
  yield k.saveExcelDatas(pId, payload.sectors ?? [], payload.departments ?? []);
  yield put(fetchData());
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
