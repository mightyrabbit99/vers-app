import { all, put, takeLatest } from "redux-saga/effects";

import {
  reload,
  _reload,
  reloadSuccess,
  calculate,
  calculateSuccess,
  saveData,
  _saveData,
  delData,
  _delData,
  selPlant,
} from "src/slices/data";
import { createNew, modify, erase } from "src/slices/sync";
import { SaveDataAction, DeleteDataAction, ReloadDataAction } from "src/types";
import k, { Department, Sector, Subsector } from "src/kernel";

function* reloadData({ payload: p }: ReloadDataAction) {
  let plants,
    sectors: { [id: number]: Sector },
    subsectors: { [id: number]: Subsector },
    skills,
    departments: { [id: number]: Department },
    employees,
    jobs;
  let newPlant,
    newSector,
    newSubsector,
    newSkill,
    newDepartment,
    newEmployee,
    newJob;
  plants = k.plantStore.getLst();
  newPlant = k.plantStore.getNew();
  sectors = k.secStore.getLst(p ? (x) => x.plant === p : undefined);
  newSector = k.secStore.getNew({ plant: p });
  subsectors = k.subsecStore.getLst((x) => x.sector in sectors);
  newSubsector = k.subsecStore.getNew();
  skills = k.skillStore.getLst((x) => x.subsector in subsectors);
  newSkill = k.skillStore.getNew();
  departments = k.deptStore.getLst();
  newDepartment = k.deptStore.getNew();
  employees = k.empStore.getLst(
    (x) => x.department in departments && x.subsector in subsectors
  );
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
  yield put(calculate());
  yield put(reloadSuccess());
}

function* selectPlant({ payload: p }: ReloadDataAction) {
  p ? localStorage.setItem("lastPlant", `${p}`) : localStorage.removeItem("lastPlant");
  yield p && put(reload(p));
}

function* calculateDatas() {
  yield put(calculateSuccess());
}

function* delDataCascadeThenCalculate({ payload }: DeleteDataAction): any {
  if (!(payload instanceof Array)) {
    payload = [payload];
  }
  let mods,
    dels,
    finalMods = [],
    finalDels = [];
  for (let p of payload) {
    [mods, dels] = yield k.calcChanges(p);
    finalMods.push(...mods);
    finalDels.push(...dels);
  }
  yield put(modify(finalMods));
  yield put(erase(finalDels));
  yield put(_saveData(finalMods));
  yield put(_delData(finalDels));
  yield put(calculate());
}

function* saveDataCascadeThenCalculate({ payload }: SaveDataAction) {
  if (payload.id === -1) {
    yield put(createNew(payload));
  } else {
    yield put(modify(payload));
    yield put(_saveData(payload));
    yield put(calculate());
  }
}

function* dataSaga() {
  yield all([
    takeLatest(reload.type, reloadData),
    takeLatest(selPlant.type, selectPlant),
    takeLatest(calculate.type, calculateDatas),
    takeLatest(saveData.type, saveDataCascadeThenCalculate),
    takeLatest(delData.type, delDataCascadeThenCalculate),
  ]);
}

export default dataSaga;
