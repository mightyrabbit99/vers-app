import { all, put, select, takeLatest } from "redux-saga/effects";

import {
  reload,
  _reload,
  reloadSuccess,
  calculate,
  calculateSuccess,
  saveData,
  delData,
  selPlant,
} from "src/slices/data";
import { createNew, modify, erase } from "src/slices/sync";
import { SaveDataAction, DeleteDataAction, ReloadDataAction } from "src/types";
import k, { Department, Sector, Subsector } from "src/kernel";
import { getData } from "src/selectors";

function* reloadData() {
  let plants,
    sectors: { [id: number]: Sector },
    subsectors: { [id: number]: Subsector },
    skills,
    departments: { [id: number]: Department },
    employees,
    jobs,
    forecasts,
    logs;
  let newPlant,
    newSector,
    newSubsector,
    newSkill,
    newDepartment,
    newEmployee,
    newJob,
    newForecast;

  let { selectedPlantId: p } = yield select(getData);
  plants = k.plantStore.getLst();
  newPlant = k.plantStore.getNew();
  p && !(p in plants) && (p = undefined);
  !p && (p = (Object.values(plants).length > 0 ? Object.values(plants)[0].id : undefined));
  p ? localStorage.setItem("lastPlant", `${p}`) : localStorage.removeItem("lastPlant");
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
  forecasts = k.forecastStore.getLst();
  newForecast = k.forecastStore.getNew();
  logs = k.logStore.getLst();
  let personalLogs = k.personalLogs;
  
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
      forecasts,
      newForecast,
      logs,
      personalLogs,
    })
  );
  yield put(calculate());
  yield put(reloadSuccess());
}

function* selectPlant({ payload: p }: ReloadDataAction) {
  yield p && put(reload());
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
}

function* saveDataCascadeThenCalculate({ payload }: SaveDataAction) {
  if (payload.id === -1) {
    yield put(createNew(payload));
  } else {
    yield put(modify(payload));
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
