import { all, put, takeLatest, call } from "redux-saga/effects";
import k, { Result } from "src/kernel";

import {
  calculate,
  _saveNewData,
  _reload,
  reload,
  reloadSuccess,
  reloadError,
} from "src/slices/data";
import {
  createNew,
  modify,
  erase,
  submitError,
  submitSuccess,
  fetchData,
  fetchDataSuccess,
} from "src/slices/sync";
import { CreateNewAction, EraseAction, ModifyAction } from "src/types";

function* fetchDatas() {
  let plants, sectors, subsectors, skills, departments, employees;
  let newPlant, newSector, newSubsector, newSkill, newDepartment, newEmployee;
  yield put(reload());
  try {
    yield call(k.refresh);
    plants = k.plantStore.getLst();
    newPlant = k.plantStore.getNew();
    sectors = k.secStore.getLst();
    newSector = k.secStore.getNew();
    subsectors = k.subsecStore.getLst();
    newSubsector = k.subsecStore.getNew();
    skills = k.skillStore.getLst();
    newSkill = k.skillStore.getNew();
    departments = k.deptStore.getLst();
    newDepartment = k.deptStore.getNew();
    employees = k.empStore.getLst();
    newEmployee = k.empStore.getNew();
    yield put(
      _reload({
        plants,
        newPlant,
        sectors,
        newSector,
        subsectors,
        newSubsector,
        skills,
        newSkill,
        departments,
        newDepartment,
        employees,
        newEmployee,
      })
    );
    yield put(reloadSuccess());
  } catch (error) {
    yield put(reloadError(error.message));
  }
  yield put(calculate());
  yield put(fetchDataSuccess());
}

function* postItemThenSave({ payload }: CreateNewAction) {
  try {
    console.log(payload);
    const feedback: Result = yield call(async () => await k.saveNew(payload));
    console.log(feedback);
    if (feedback.success) {
      yield put(_saveNewData(feedback.data));
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
      yield call(async () => await k.save(p));
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
      yield call(async () => await k.del(p));
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
