import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItemType, Item } from "src/kernel";
import { DataState } from "src/types";

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
    case ItemType.Department:
      return state.departments;
    case ItemType.Employee:
      return state.employees;
    case ItemType.Job:
      return state.jobs;
    default:
      return {};
  }
}

export const initialState: DataState = {
  plants: {},
  sectors: {},
  subsectors: {},
  departments: {},
  skills: {},
  employees: {},
  jobs: {},
  logs: {},
  personalLogs: [],
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
      state.departments = payload.departments ?? {};
      state.newDepartment = payload.newDepartment ?? undefined;
      state.employees = payload.employees ?? {};
      state.newEmployee = payload.newEmployee ?? undefined;
      state.jobs = payload.jobs ?? {};
      state.newJob = payload.newJob ?? undefined;
    },
    reload: (state, { payload }: PayloadAction<number | undefined>) => {
      state.loading = true;
      state.plants = {};
      state.newPlant = undefined;
      state.sectors = {};
      state.newSector = undefined;
      state.subsectors = {};
      state.newSubsector = undefined;
      state.skills = {};
      state.newSkill = undefined;
      state.departments = {};
      state.newDepartment = undefined;
      state.employees = {};
      state.newEmployee = undefined;
      state.jobs = {};
      state.newJob = undefined;
    },
    reloadSuccess: (state) => {
      state.loading = false;
    },
    reloadError: (state, { payload }: PayloadAction<string>) => {
      state.loading = false;
      state.error = payload;
    },
    calculate: (state) => {
      state.calculating = true;
    },
    calculateSuccess: (state) => {
      state.calculating = false;
    },
    _saveData: (state, { payload }: PayloadAction<Item | Item[]>) => {
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
    saveData: (state, { payload }: PayloadAction<Item | Item[]>) => {
      state.loading = true;
    },
    delData: (state, { payload }: PayloadAction<Item | Item[]>) => {
      state.loading = true;
    },
    _delData: (state, { payload }: PayloadAction<Item | Item[]>) => {
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
        selLst(type, state)[id][prop] = val;
      }
    },
    selPlant: (state, { payload }: PayloadAction<number | undefined>) => {
      state.selectedPlantId = payload;
    },
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
} = dataSlice.actions;

export default dataSlice.reducer;
