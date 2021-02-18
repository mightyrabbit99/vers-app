import { all, put, takeLatest } from "redux-saga/effects";

import {
  reload,
  _reload,
  calculate,
  calculateSuccess,
  saveData,
  _saveData,
  delData,
  _delData,
} from "src/slices/data";
import { createNew, modify, erase } from "src/slices/sync";
import { SaveDataAction, DeleteDataAction } from "src/types";
import k from "src/kernel";

function* calculateDatas() {
  yield put(calculateSuccess());
}

function* clearAll() {
  yield put(_reload({}));
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
  console.log(finalDels);
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
    takeLatest(reload.type, clearAll),
    takeLatest(calculate.type, calculateDatas),
    takeLatest(saveData.type, saveDataCascadeThenCalculate),
    takeLatest(delData.type, delDataCascadeThenCalculate),
  ]);
}

export default dataSaga;
