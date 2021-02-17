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
  loading: true,
  calculating: false,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    _reload: (state, { payload }: PayloadAction<any>) => {
      state.plants = payload.plants;
      state.newPlant = payload.newPlant;
      state.sectors = payload.sectors;
      state.newSector = payload.newSector;
      state.subsectors = payload.subsectors;
      state.newSubsector = payload.newSubsector;
      state.skills = payload.skills;
      state.newSkill = payload.newSkill;
      state.departments = payload.departments;
      state.newDepartment = payload.newDepartment;
      state.employees = payload.employees;
      state.newEmployee = payload.newEmployee;
    },
    reload: (state) => {
      state.loading = true;
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
        Object.assign(selLst(type, state)[id], p);
      }
    },
    saveData: (state, { payload }: PayloadAction<Item>) => {
      state.loading = true;
    },
    _saveNewData: (state, { payload }: PayloadAction<Item>) => {
      const { _type: type, id } = payload;
      console.log(payload);
      selLst(type, state)[id] = payload;
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
  _saveNewData,
  delData,
  _delData,
  saveItemProp,
} = dataSlice.actions;

export default dataSlice.reducer;
