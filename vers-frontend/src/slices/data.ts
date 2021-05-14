import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItemType, Item } from "src/kernel";
import {
  DataState,
  DownloadExcelAction,
  SaveDataAction,
  MyError,
  DeleteDataAction,
} from "src/types";

type DetailChange = { type: ItemType; id: number; prop: string; val: any };

function selLst(type: ItemType, state: DataState): { [id: number]: Item } {
  switch (type) {
    case ItemType.Plant:
      return state.plants;
    case ItemType.Sector:
      return state.sectors;
    case ItemType.Subsector:
      return state.subsectors;
    case ItemType.Skill:
      return state.skills;
    case ItemType.Employee:
      return state.employees;
    case ItemType.Job:
      return state.jobs;
    case ItemType.Forecast:
      return state.forecasts;
    case ItemType.CalEvent:
      return state.calEvents;
    default:
      return {};
  }
}

export const initialState: DataState = {
  plants: {},
  sectors: {},
  subsectors: {},
  skills: {},
  employees: {},
  jobs: {},
  forecasts: {},
  logs: {},
  calEvents: {},
  personalLogs: [],
  users: {},
  loading: true,
  calculating: false,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    _reload: (state, { payload }: PayloadAction<any>) => {
      state.plants = payload.plants ?? {};
      state.newPlant = payload.newPlant ?? undefined;
      state.sectors = payload.sectors ?? {};
      state.newSector = payload.newSector ?? undefined;
      state.subsectors = payload.subsectors ?? {};
      state.newSubsector = payload.newSubsector ?? undefined;
      state.skills = payload.skills ?? {};
      state.newSkill = payload.newSkill ?? undefined;
      state.employees = payload.employees ?? {};
      state.newEmployee = payload.newEmployee ?? undefined;
      state.jobs = payload.jobs ?? {};
      state.newJob = payload.newJob ?? undefined;
      state.forecasts = payload.forecasts ?? {};
      state.newForecast = payload.newForecast ?? undefined;
      state.calEvents = payload.calEvents ?? {};
      state.newCalEvent = payload.newCalEvent ?? undefined;
      state.logs = payload.logs ?? {};
      state.personalLogs = payload.personalLogs ?? [];
      state.users = payload.users ?? {};
    },
    reload: (state, { payload }: PayloadAction<undefined | boolean>) => {
      state.loading = payload === undefined || payload;
    },
    reloadSuccess: (state) => {
      state.loading = false;
    },
    reloadError: (state, { payload }: PayloadAction<undefined | MyError>) => {
      state.loading = false;
      state.error = payload;
    },
    calculate: (state) => {
      state.calculating = true;
    },
    calculateSuccess: (state) => {
      state.calculating = false;
    },
    saveData: (
      state,
      { payload }: PayloadAction<SaveDataAction["payload"]>
    ) => {},
    delData: (
      state,
      { payload }: PayloadAction<DeleteDataAction["payload"]>
    ) => {},
    _saveData: (
      state,
      { payload }: PayloadAction<SaveDataAction["payload"]>
    ) => {
      if (!(payload instanceof Array)) {
        payload = [payload];
      }
      for (let p of payload) {
        const { _type: type, id } = p;
        let lst = selLst(type, state);
        if (lst[id]) {
          Object.assign(lst[id], p);
        } else {
          lst[id] = p;
        }
      }
    },
    _delData: (
      state,
      { payload }: PayloadAction<DeleteDataAction["payload"]>
    ) => {
      if (!(payload instanceof Array)) {
        payload = [payload];
      }
      for (let p of payload) {
        const { _type: type, id } = p;
        delete selLst(type, state)[id];
      }
    },
    saveItemProp: (
      state,
      { payload }: PayloadAction<DetailChange | DetailChange[]>
    ) => {
      if (!(payload instanceof Array)) {
        payload = [payload];
      }
      for (let p of payload) {
        const { type, id, prop, val } = p;
        (selLst(type, state) as any)[id][prop] = val;
      }
    },
    selPlant: (state, { payload }: PayloadAction<number | undefined>) => {
      state.selectedPlantId = payload;
    },
    clearMyLog: (state) => {
      state.personalLogs = [];
    },
    clearLog: (state) => {
      state.logs = {};
    },
    downloadExcel: (
      state,
      { payload }: PayloadAction<DownloadExcelAction["payload"]>
    ) => {},
  },
});

export const {
  _reload,
  reload,
  reloadSuccess,
  reloadError,
  calculate,
  calculateSuccess,
  saveData,
  _saveData,
  delData,
  _delData,
  saveItemProp,
  selPlant,
  downloadExcel,
  clearMyLog,
  clearLog,
} = dataSlice.actions;

export default dataSlice.reducer;
