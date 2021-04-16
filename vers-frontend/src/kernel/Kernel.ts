import EmployeeStore, { Employee } from "./Employee";
import Fetcher from "./Fetcher";
import JobStore, { Job } from "./Job";
import PlantStore, { Plant } from "./Plant";
import SectorStore, { Sector } from "./Sector";
import SkillStore, { Skill } from "./Skill";
import { Store, ItemType, Result as SubmitResult } from "./Store";
import SubsectorStore, { Subsector } from "./Subsector";
import ForecastStore, { Forecast } from "./Forecast";
import LogStore, { DataType, Log } from "./Log";
import CalEventStore, { CalEvent } from "./CalEvent";
import { MyLog } from "./types";

import ExcelProcessor3, {
  EmployeeObj,
  ExcelObj,
  SectorObj,
  SkillObj,
  SubsectorObj,
  ExcelObjConverter,
  ForecastObj,
  CalEventObj,
} from "./ExcelProcessor3";
import UserStore, { User } from "./User";
import HeadCalc, { CalcVars } from "./HeadCalc";
import { Cal } from "src/utils/tools";

const epsTi = 500;

enum DataAction {
  CREATE_NEW = 0,
  EDIT = 1,
  DELETE = 2,
}

type Item =
  | Plant
  | Sector
  | Skill
  | Subsector
  | Forecast
  | Employee
  | Job
  | CalEvent
  | Log
  | User;

const getMyLog = (): MyLog[] => {
  let s = localStorage.getItem("MyLog");
  if (!s) return [];
  try {
    let res = JSON.parse(s);
    if (res instanceof Array) return res;
    else return [];
  } catch (e) {
    return [];
  }
};

const setMyLog = (lst: MyLog[]) => {
  localStorage.setItem("MyLog", JSON.stringify(lst));
};

class Kernel {
  soc: WebSocket | undefined;
  plantStore: Store<Plant>;
  secStore: Store<Sector>;
  subsecStore: Store<Subsector>;
  skillStore: Store<Skill>;
  empStore: Store<Employee>;
  jobStore: Store<Job>;
  forecastStore: Store<Forecast>;
  logStore: Store<Log>;
  calEventStore: Store<CalEvent>;
  userStore: Store<User>;
  personalLogs: MyLog[];
  calc: HeadCalc;
  cal: Cal<number>;
  objConverter: ExcelObjConverter;

  constructor() {
    this.plantStore = new PlantStore();
    this.secStore = new SectorStore();
    this.subsecStore = new SubsectorStore();
    this.skillStore = new SkillStore();
    this.empStore = new EmployeeStore();
    this.jobStore = new JobStore();
    this.forecastStore = new ForecastStore();
    this.logStore = new LogStore();
    this.calEventStore = new CalEventStore();
    this.userStore = new UserStore();
    this.personalLogs = getMyLog();
    this.calc = new HeadCalc();
    this.cal = new Cal();
    this.objConverter = new ExcelObjConverter(
      this.plantStore,
      this.secStore,
      this.subsecStore,
      this.skillStore,
      this.empStore,
      this.forecastStore,
      this.calEventStore
    );
  }

  private getStore = (t: DataType) => {
    switch (t) {
      case DataType.PLANT:
        return this.plantStore;
      case DataType.SECTOR:
        return this.secStore;
      case DataType.SUBSECTOR:
        return this.subsecStore;
      case DataType.SKILL:
        return this.skillStore;
      case DataType.EMPLOYEE:
        return this.empStore;
      case DataType.JOB:
        return this.jobStore;
      case DataType.FORECAST:
        return this.forecastStore;
      case DataType.CALEVENT:
        return this.calEventStore;
      case DataType.LOG:
        return this.logStore;
      case DataType.USER:
        return this.userStore;
    }
  };

  private getStore2 = (t: ItemType) => {
    switch (t) {
      case ItemType.Plant:
        return this.plantStore;
      case ItemType.Sector:
        return this.secStore;
      case ItemType.Subsector:
        return this.subsecStore;
      case ItemType.Skill:
        return this.skillStore;
      case ItemType.Employee:
        return this.empStore;
      case ItemType.Job:
        return this.jobStore;
      case ItemType.Forecast:
        return this.forecastStore;
      case ItemType.CalEvent:
        return this.calEventStore;
      case ItemType.Log:
        return this.logStore;
      case ItemType.User:
        return this.userStore;
    }
  };

  trigger = () => {};
  private ti: NodeJS.Timeout | undefined;
  private triggerDamp = () => {
    if (this.ti) clearTimeout(this.ti);
    this.ti = setTimeout(this.trigger, epsTi);
  };

  registerSocket = (soc?: WebSocket) => {
    let socket = soc ?? Fetcher.getSoc();
    if (!socket) return;
    if (this.soc) this.soc.close();
    this.soc = socket;
    this.soc.onmessage = (e: MessageEvent<any>) => {
      const payload = JSON.parse(e.data);
      switch (payload.action) {
        case DataAction.CREATE_NEW:
        case DataAction.EDIT:
          this.getStore(payload.data_type)?.addData(payload.content);
          if (payload.data_type === DataType.CALEVENT) {
            this.cal.addEvent({
              range: [
                new Date(payload.content.start),
                new Date(payload.content.end),
              ],
              data: payload.content["id"],
            });
          }
          this.triggerDamp();
          break;
        case DataAction.DELETE:
          this.getStore(payload.data_type)?.eraseData(payload.content);
          if (payload.data_type === DataType.CALEVENT) {
            this.cal.delEvent({
              range: [
                new Date(payload.content.start),
                new Date(payload.content.end),
              ],
              data: payload.content["id"],
            });
          }
          this.triggerDamp();
          break;
      }
    };
    this.soc.onclose = (e: CloseEvent) => {
      this.soc = undefined;
    };
  };

  refresh = async (lst?: ItemType | ItemType[]) => {
    if (!lst) lst = Object.values(ItemType);
    if (!(lst instanceof Array)) {
      lst = [lst];
    }
    await Promise.all(lst.map((x) => this.getStore2(x)?.refresh()));
    this.cal = new Cal();
    this.cal.addEvents(
      Object.values(this.calEventStore.getLst()).map((x) => ({
        range: [new Date(x.start), new Date(x.end)],
        data: x.id,
      }))
    );
  };

  private _log = (desc: string, ...data: SubmitResult[]) => {
    let sanitized = data.map((x) =>
      x.success
        ? x
        : {
            success: x.success,
            statusText: x.statusText,
            data: {
              name: x.data.name,
              firstName: x.data.firstName,
              lastName: x.data.lastName,
              on: x.data.on,
              title: x.data.title,
            },
          }
    );
    this.personalLogs = [
      ...this.personalLogs,
      { desc, time: Date.now(), vals: sanitized },
    ];
    setMyLog(this.personalLogs);
  };

  clearLog = () => {
    this.personalLogs = [];
    setMyLog([]);
  };

  private _saveNew = async (t: Item) => {
    switch (t._type) {
      case ItemType.Plant:
        return await this.plantStore.submitNew(t as Plant);
      case ItemType.Sector:
        return await this.secStore.submitNew(t as Sector);
      case ItemType.Subsector:
        return await this.subsecStore.submitNew(t as Subsector);
      case ItemType.Skill:
        return await this.skillStore.submitNew(t as Skill);
      case ItemType.Employee:
        return await this.empStore.submitNew(t as Employee);
      case ItemType.Job:
        return await this.jobStore.submitNew(t as Job);
      case ItemType.Forecast:
        return await this.forecastStore.submitNew(t as Forecast);
      case ItemType.CalEvent:
        return await this.calEventStore.submitNew(t as CalEvent);
      default:
        return { success: false, statusText: "", data: {} };
    }
  };

  saveNew = async (t: Item) => {
    let a = await this._saveNew(t);
    this._log("Create", a);
    if (!this.soc) {
      this.refresh();
      this.trigger();
    }
    return a;
  };

  private _save = async (t: Item): Promise<SubmitResult> => {
    switch (t._type) {
      case ItemType.Plant:
        return await this.plantStore.submit(t as Plant);
      case ItemType.Sector:
        return await this.secStore.submit(t as Sector);
      case ItemType.Subsector:
        return await this.subsecStore.submit(t as Subsector);
      case ItemType.Skill:
        return await this.skillStore.submit(t as Skill);
      case ItemType.Employee:
        return await this.empStore.submit(t as Employee);
      case ItemType.Job:
        return await this.jobStore.submit(t as Job);
      case ItemType.Forecast:
        return await this.forecastStore.submit(t as Forecast);
      case ItemType.CalEvent:
        return await this.calEventStore.submit(t as CalEvent);
      case ItemType.User:
        return await this.userStore.submit(t as User);
      default:
        return { success: false, statusText: "", data: {} };
    }
  };

  save = async (t: Item): Promise<SubmitResult> => {
    let a = await this._save(t);
    this._log("Save", a);
    if (!this.soc) {
      this.refresh();
      this.trigger();
    }
    return a;
  };

  private _del = async (t: Item): Promise<SubmitResult> => {
    switch (t._type) {
      case ItemType.Plant:
        return await this.plantStore.remove(t as Plant);
      case ItemType.Sector:
        return await this.secStore.remove(t as Sector);
      case ItemType.Subsector:
        return await this.subsecStore.remove(t as Subsector);
      case ItemType.Skill:
        return await this.skillStore.remove(t as Skill);
      case ItemType.Employee:
        return await this.empStore.remove(t as Employee);
      case ItemType.Job:
        return await this.jobStore.remove(t as Job);
      case ItemType.Forecast:
        return await this.forecastStore.remove(t as Forecast);
      case ItemType.Log:
        return await this.logStore.remove(t as Log);
      case ItemType.CalEvent:
        return await this.calEventStore.remove(t as CalEvent);
      case ItemType.User:
        return await this.userStore.remove(t as User);
      default:
        return { success: false, statusText: "", data: {} };
    }
  };

  private calcCascadeChanges = (payload: Item) => {
    let mods: Item[] = [],
      dels: Item[] = [];
    let sectors = this.secStore.getLst();
    let subsectors = this.subsecStore.getLst();
    let employees = this.empStore.getLst();
    let skills = this.skillStore.getLst();
    let jobs = this.jobStore.getLst();
    function cascadeDel(p: Item) {
      dels.push(p);
      switch (p._type) {
        case ItemType.Plant:
          (p as Plant).sectors.map((x) => sectors[x]).forEach(cascadeDel);
          break;
        case ItemType.Sector:
          (p as Sector).subsectors
            .map((x) => subsectors[x])
            .forEach(cascadeDel);
          break;
        case ItemType.Subsector:
          (p as Subsector).skills.map((x) => skills[x]).forEach(cascadeDel);
          (p as Subsector).employees
            .map((x) => employees[x])
            .forEach(cascadeDel);
          (p as Subsector).jobs.map((x) => jobs[x]).forEach(cascadeDel);
          break;
      }
    }
    function cascadeMod2(p: Item) {
      mods.push(p);
    }

    function cascadeMod(p: Item) {
      switch (p._type) {
        case ItemType.Skill:
          (p as Skill).employees
            .map((x) => employees[x.employee])
            .forEach((x) =>
              cascadeMod2({
                ...x,
                skills: x.skills.filter((y) => y.skill !== p.id),
              })
            );
      }
    }
    cascadeDel(payload);
    cascadeMod(payload);
    mods.reverse();
    dels.reverse();
    return [mods, dels];
  };

  del = async (t: Item) => {
    let [mods, dels] = this.calcCascadeChanges(t);
    let logs = [];
    logs.push(...(await Promise.all(mods.map((x) => this._save(x)))));
    logs.push(...(await Promise.all(dels.map((x) => this._del(x)))));
    this._log("Delete", ...logs);
    if (!this.soc) {
      this.refresh();
      this.trigger();
    }
    return { success: logs.every((x) => x.success) };
  };

  login = async (
    username: string,
    password: string,
    remember: boolean = false
  ) => {
    try {
      let res = await Fetcher.login(username, password);
      remember && Fetcher.saveToken();
      return { success: res.status === 200, data: res.data };
    } catch (e) {
      return { success: false };
    }
  };

  logout = () => {
    Fetcher.logout();
    if (this.soc) this.soc.close();
  };

  isLoggedIn = Fetcher.isLoggedIn;
  getUser = async (): Promise<SubmitResult> => {
    try {
      let res = await Fetcher.getUser();
      this.registerSocket();
      return { success: true, statusText: "", data: res.data };
    } catch (e) {
      return { success: false, statusText: "", data: null };
    }
  };

  editUser = async (username: string, password: string) => {
    let res;
    try {
      res = await Fetcher.putUser(username, password);
    } catch (e) {
      res = e.response;
    }
    return { success: res.status === 200, data: res.data };
  };

  setPid = (pId: number) => {
    this.objConverter.setPid(pId);
  };

  submitExcel = (type: ItemType, data: ExcelObj[]) => {
    let conv = this.objConverter;
    switch (type) {
      case ItemType.Sector:
        conv
          .convObjsToSectors(data as SectorObj[])
          .forEach(this.secStore.submitOrNew);
        break;
      case ItemType.Subsector:
        conv
          .convObjsToSubsectors(data as SubsectorObj[])
          .forEach(this.subsecStore.submitOrNew);
        break;
      case ItemType.Skill:
        conv
          .convObjsToSkills(data as SkillObj[])
          .forEach(this.skillStore.submitOrNew);
        break;
      case ItemType.Employee:
        conv
          .convObjsToEmployees(data as EmployeeObj[])
          .forEach(this.empStore.submitOrNew);
        break;
      case ItemType.Forecast:
        conv
          .convObjsToForecasts(data as ForecastObj[])
          .forEach(this.forecastStore.submitOrNew);
        break;
      case ItemType.CalEvent:
        conv
          .convObjsToCalEvents(data as CalEventObj[])
          .forEach(this.calEventStore.submitOrNew);
        break;
      default:
        break;
    }
  };

  getExcel = (type: ItemType, items?: Item[]) => {
    let conv = this.objConverter;
    let itms, objs;
    switch (type) {
      case ItemType.Sector:
        itms = (items as Sector[]) ?? Object.values(this.secStore.getLst());
        objs = conv.convSectorsToObjs(itms);
        return ExcelProcessor3.genSectorFile(objs);
      case ItemType.Subsector:
        itms =
          (items as Subsector[]) ?? Object.values(this.subsecStore.getLst());
        objs = conv.convSubsectorsToObjs(itms);
        return ExcelProcessor3.genSubsectorFile(objs);
      case ItemType.Skill:
        itms = (items as Skill[]) ?? Object.values(this.skillStore.getLst());
        objs = conv.convSkillsToObjs(itms);
        return ExcelProcessor3.genSkillFile(objs);
      case ItemType.Employee:
        itms = (items as Employee[]) ?? Object.values(this.empStore.getLst());
        objs = conv.convEmployeesToObjs(itms);
        return ExcelProcessor3.genEmployeeFile(objs);
      case ItemType.Forecast:
        itms =
          (items as Forecast[]) ?? Object.values(this.forecastStore.getLst());
        objs = conv.convForecastsToObjs(itms);
        return ExcelProcessor3.genForecastFile(objs);
      case ItemType.CalEvent:
        itms =
          (items as CalEvent[]) ?? Object.values(this.calEventStore.getLst());
        objs = conv.convCalEventsToObjs(itms);
        return ExcelProcessor3.genCalEventFile(objs);
      default:
        break;
    }
  };

  setVars = (vars: CalcVars) => {
    this.calc.setVars(vars);
  };

  getVars = () => this.calc.getVars();

  calcHeadcountReq = (
    skill: Skill,
    subsec: Subsector,
    forecast: number,
    month?: string
  ) => {
    let workingDays = month ? this.cal.getDaysLeftInMonth(new Date(month)) : 27;
    return this.calc.calcHeadcountReq(skill, subsec, forecast, workingDays);
  };
}

export type { Item, Kernel };
export default Kernel;
