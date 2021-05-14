import { all, put, select, takeLatest } from "redux-saga/effects";
import { saveAs } from "file-saver";

import {
  reload,
  _reload,
  reloadSuccess,
  calculate,
  calculateSuccess,
  saveData,
  delData,
  selPlant,
  downloadExcel,
  clearMyLog,
  clearLog,
} from "src/slices/data";
import { createNew, modify, erase } from "src/slices/sync";
import {
  SaveDataAction,
  DeleteDataAction,
  ReloadDataAction,
  ReloadData2Action,
  DownloadExcelAction,
} from "src/types";
import k, { Sector, Subsector } from "src/kernel";
import { getData, getSession } from "src/selectors";

function* reloadData({ payload }: ReloadDataAction) {
  let plants,
    sectors: { [id: number]: Sector },
    subsectors: { [id: number]: Subsector },
    skills,
    employees,
    jobs,
    forecasts,
    calEvents,
    logs,
    users;
  let newPlant,
    newSector,
    newSubsector,
    newSkill,
    newEmployee,
    newJob,
    newForecast,
    newCalEvent;
  let { selectedPlantId: p } = yield select(getData);
  plants = k.plantStore.getLst();
  newPlant = k.plantStore.getNew();
  if (p && !(p in plants)) p = undefined;
  if (!p) {
    p = Object.values(plants).length > 0
        ? Object.values(plants)[0].id
        : undefined;
  }
  if (p) {
    localStorage.setItem("lastPlant", `${p}`)
  } else {
    localStorage.removeItem("lastPlant");
  }
  sectors = k.secStore.getLst(p ? (x) => x.plant === p : undefined);
  newSector = k.secStore.getNew({ plant: p });
  subsectors = k.subsecStore.getLst((x) => x.sector in sectors);
  newSubsector = k.subsecStore.getNew();
  skills = k.skillStore.getLst((x) => x.subsector in subsectors);
  newSkill = k.skillStore.getNew();
  employees = k.empStore.getLst();
  newEmployee = k.empStore.getNew();
  jobs = k.jobStore.getLst((x) => x.subsector in subsectors);
  newJob = k.jobStore.getNew();
  forecasts = k.forecastStore.getLst();
  newForecast = k.forecastStore.getNew();
  calEvents = k.calEventStore.getLst();
  newCalEvent = k.calEventStore.getNew();
  logs = k.logStore.getLst();
  let personalLogs = k.personalLogs;
  users = k.userStore.getLst();
  const { user } = yield select(getSession);
  if (user) {
    users = Object.fromEntries(Object.entries(users).filter(([x, y]) => y.id !== user.id));
  }
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
      employees,
      newEmployee,
      jobs,
      newJob,
      forecasts,
      newForecast,
      calEvents,
      newCalEvent,
      logs,
      personalLogs,
      users,
    })
  );
  yield put(calculate());
  if (payload === undefined || payload) {
    yield put(reloadSuccess());
  }
}

function* selectPlant({ payload: p }: ReloadData2Action) {
  yield p && put(reload(true));
}

function* calculateDatas() {
  yield put(calculateSuccess());
}

function* delDataCascadeThenCalculate({ payload }: DeleteDataAction): any {
  if (!(payload instanceof Array)) {
    payload = [payload];
  }
  yield put(erase(payload));
}

function* saveDataCascadeThenCalculate({ payload }: SaveDataAction) {
  if (!(payload instanceof Array)) {
    payload = [payload];
  }
  let part = payload.reduce((pr, cu) => {
    if (cu.id === -1) {
      pr.create.push(cu);
    } else {
      pr.modify.push(cu);
    }
    return pr;
  }, { create: [] as typeof payload, modify: [] as typeof payload});
  yield part.create.length > 0 && put(createNew(payload));
  yield part.modify.length > 0 && put(modify(payload));
}

function* downExcel({ payload }: DownloadExcelAction) {
  let { type, items } = payload;
  let s: Buffer = yield k.getExcel(type, items);
  var blob = new Blob([s], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${type}.xlsx`);
}

function delPersonalLogs() {
  k.clearMyLog();
}

function delLogs() {
  k.delAllLog();
}

function* dataSaga() {
  yield all([
    takeLatest(reload.type, reloadData),
    takeLatest(selPlant.type, selectPlant),
    takeLatest(calculate.type, calculateDatas),
    takeLatest(saveData.type, saveDataCascadeThenCalculate),
    takeLatest(delData.type, delDataCascadeThenCalculate),
    takeLatest(downloadExcel.type, downExcel),
    takeLatest(clearMyLog.type, delPersonalLogs),
    takeLatest(clearLog.type, delLogs),
  ]);
}

export default dataSaga;
