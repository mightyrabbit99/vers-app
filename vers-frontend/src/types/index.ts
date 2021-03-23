import {
  Plant,
  Sector,
  Subsector,
  Department,
  Skill,
  Employee,
  Job,
  Log,
  MyLog,
  ItemType,
  CalEvent,
  Item,
  User,
} from "src/kernel";
import { UserData } from "src/kernel/data/UserData";
import { Forecast } from "src/kernel/Forecast";
import { delData, saveData, reload } from "src/slices/data";
import { changeUserDetail, login } from "src/slices/session";
import { createNew, erase, fetchData, modify, submitExcel } from "src/slices/sync";

export interface FetchDataAction {
  type: typeof fetchData.type;
  payload?: ItemType | ItemType[];
}

export interface ReloadDataAction {
  type: typeof reload.type;
  payload?: number;
}

export interface EraseAction {
  type: typeof erase.type;
  payload: Item | Item[];
}

export interface CreateNewAction {
  type: typeof createNew.type;
  payload: Item;
}

export interface ModifyAction {
  type: typeof modify.type;
  payload: Item | Item[];
}

export interface SaveDataAction {
  type: typeof saveData.type;
  payload: Item;
}

export interface DownloadExcelAction {
  type: typeof saveData.type;
  payload: { type: ItemType, items?: Item[] };
}

export interface SubmitExcelAction {
  type: typeof submitExcel.type;
  payload: {
    type: ItemType;
    data: any;
  };
}

export interface DeleteDataAction {
  type: typeof delData.type;
  payload: Item | Item[];
}

export interface LoginAction {
  type: typeof login.type;
  payload: any;
}

export interface EditUserAction {
  type: typeof changeUserDetail.type;
  payload: {
    username: string;
    password: string;
  };
}

export interface RootState {
  dataState: DataState;
  syncState: SyncState;
  settingsState: SettingsState;
  sessionState: SessionState;
}

type IdMap<T> = { [id: number]: T };

export interface MyError {
  data?: any;
  message: string;
}

export interface DataState {
  plants: IdMap<Plant>;
  selectedPlantId?: number;
  newPlant?: Plant;
  sectors: IdMap<Sector>;
  newSector?: Sector;
  subsectors: IdMap<Subsector>;
  newSubsector?: Subsector;
  skills: IdMap<Skill>;
  newSkill?: Skill;
  departments: IdMap<Department>;
  newDepartment?: Department;
  employees: IdMap<Employee>;
  newEmployee?: Employee;
  jobs: IdMap<Job>;
  newJob?: Job;
  forecasts: IdMap<Forecast>;
  newForecast?: Forecast;
  calEvents: IdMap<CalEvent>;
  newCalEvent?: CalEvent;
  logs: IdMap<Log>;
  personalLogs: MyLog[];
  users: IdMap<User>;
  loading: boolean;
  calculating: boolean;
  error?: MyError;
}

export interface SyncState {
  syncing: boolean;
  feedback?: any;
  error?: MyError;
}

export interface SettingsState {}

export interface SessionState {
  syncing: boolean;
  user?: UserData;
  authenticated?: boolean;
  feedback?: any;
  error?: any;
}
