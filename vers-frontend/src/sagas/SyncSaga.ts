import { all, put, takeLatest, call } from "redux-saga/effects";
import k, { Result, ExcelProcessor } from "src/kernel";

import {
  calculate,
  _reload,
  reload,
  _saveData,
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
  submitExcel,
} from "src/slices/sync";
import {
  CreateNewAction,
  EraseAction,
  ModifyAction,
  SubmitExcelAction,
} from "src/types";

function* loadState() {
  let plants, sectors, subsectors, skills, departments, employees, jobs;
  let newPlant,
    newSector,
    newSubsector,
    newSkill,
    newDepartment,
    newEmployee,
    newJob;
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
  jobs = k.jobStore.getLst();
  newJob = k.jobStore.getNew();
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
      jobs,
      newJob,
    })
  );
}

function* fetchDatas() {
  try {
    yield call(k.refresh);
    yield put(reload());
    yield loadState();
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
    const feedback: Result = yield k.saveNew(payload);
    console.log(feedback);
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

function* processExcel({ payload: file }: SubmitExcelAction) {
  let lst = [];
  try {
    lst = yield ExcelProcessor.readFile(file);
  } catch (error) {
    yield put(submitSuccess(error));
    return;
  }
  let mods = lst.filter((x: any) => x.id > 0);
  let news = lst.filter((x: any) => x.id < 0);
  try {
    for (let p of mods) {
      yield k.save(p);
    }
    for (let p of news) {
      yield k.saveNew(p);
    }
  } catch (error) {
    yield put(submitError(error));
  }
  yield put(reload());
  yield loadState();
  yield put(reloadSuccess());
  yield put(submitSuccess(undefined));
}

function* syncSaga() {
  yield all([
    takeLatest(fetchData.type, fetchDatas),
    takeLatest(createNew.type, postItemThenSave),
    takeLatest(modify.type, putItem),
    takeLatest(erase.type, deleteItem),
    takeLatest(submitExcel.type, processExcel),
  ]);
}

export default syncSaga;
