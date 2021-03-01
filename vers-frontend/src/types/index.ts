import { Plant, Data, Sector, Subsector, Department, Skill, Employee, Job, Log } from "src/kernel";
import { UserData } from "src/kernel/data/UserData";
import { delData, saveData, reload } from "src/slices/data";
import { changeUserDetail, login } from "src/slices/session";
import { createNew, erase, modify } from "src/slices/sync";

export interface ReloadDataAction {
  type: typeof reload.type;
  payload: number | undefined;
}

export interface EraseAction {
  type: typeof erase.type;
  payload: Data | Data[];
}

export interface CreateNewAction {
  type: typeof createNew.type;
  payload: Data;
}

export interface ModifyAction {
  type: typeof modify.type;
  payload: Data | Data[];
}

export interface SaveDataAction {
  type: typeof saveData.type;
  payload: Data;
}

export interface DeleteDataAction {
  type: typeof delData.type;
  payload: Data | Data[];
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

type IdMap<T> = { [id: number]: T};

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

  logs: IdMap<Log>;
  personalLogs: Log[];

  loading: boolean;
  calculating: boolean;
  error?: any;
}

export interface SyncState {
  syncing: boolean;
  feedback?: any;
  error?: any;
}

export interface SettingsState {

}

export interface SessionState {
  syncing: boolean;
  user?: UserData;
  authenticated?: boolean;
  feedback?: any;
  error?: any;
}
