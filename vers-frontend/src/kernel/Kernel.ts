import EmployeeStore, { Employee } from "./Employee";
import Fetcher from "./Fetcher";
import JobStore, { Job } from "./Job";
import PlantStore, { Plant } from "./Plant";
import SectorStore, { Sector } from "./Sector";
import SkillStore, { Skill } from "./Skill";
import { Store, ItemType, Result, Activity, DataAction, Logger } from "./Store";
import SubsectorStore, { Subsector } from "./Subsector";
import ForecastStore, { Forecast } from "./Forecast";
import LogStore, { DataType, Log } from "./Log";
import CalEventStore, { CalEvent } from "./CalEvent";
import EmpFileStore, { EmpFile } from "./EmpFile";
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
import Assigner, { AssignerEnv, Heuristic } from "./Assigner";

type SubmitResult<T> = Result<Partial<T>>;

const epsTi = 150;

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
  | User
  | EmpFile;

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

class MyLogger implements Logger<Item> {
  private lst: Activity<Item>[] = [];
  record = (a: Activity<Item>) => {
    this.lst.push(a);
  };

  flush = () => {
    let sanitized = this.lst
      .map((x) => x.res)
      .map((x) => ({
        success: x.success,
        statusText: x.statusText,
        data: Object.fromEntries(
          Object.entries(x.data).filter(
            ([k, v]) => typeof v === "string" || typeof v === "number"
          )
        ),
      }));
    this.lst = [];
    return sanitized;
  };
}

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
  empFileStore: Store<EmpFile>;
  calc: HeadCalc;
  cal: Cal<number>;
  objConverter: ExcelObjConverter;
  logger: MyLogger = new MyLogger();

  constructor() {
    this.plantStore = new PlantStore(this.logger);
    this.secStore = new SectorStore(this.logger);
    this.subsecStore = new SubsectorStore(this.logger);
    this.skillStore = new SkillStore(this.logger);
    this.empStore = new EmployeeStore(this.logger);
    this.jobStore = new JobStore(this.logger);
    this.forecastStore = new ForecastStore(this.logger);
    this.logStore = new LogStore();
    this.calEventStore = new CalEventStore(this.logger);
    this.userStore = new UserStore(this.logger);
    this.personalLogs = getMyLog();
    this.empFileStore = new EmpFileStore(this.logger);
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
    this.init();
  }

  private init = () => {
    this.plantStore.registerAfterNativeTrigger((a: Activity<Plant>) => {
      let data = a.res.data;
      switch (a.typ) {
        case DataAction.DELETE:
          for (let s of data.sectors) this.secStore.erase(s);
          break;
      }
    });
    this.secStore.registerAfterNativeTrigger((a: Activity<Sector>) => {
      let data = a.res.data;
      switch (a.typ) {
        case DataAction.DELETE:
          for (let s of data.subsectors) this.subsecStore.erase(s);
          break;
      }
    });
    this.subsecStore.registerAfterNativeTrigger((a: Activity<Subsector>) => {
      let data = a.res.data;
      switch (a.typ) {
        case DataAction.DELETE:
          for (let s of data.skills) this.skillStore.erase(s);
          break;
      }
    });
    this.skillStore.registerAfterNativeTrigger((a: Activity<Skill>) => {
      if (!a.res.success) return;
      let data = a.res.data;
      switch (a.typ) {
        case DataAction.DELETE:
          for (let e of data.employees) {
            let emp = this.empStore.get(e.employee);
            this.empStore.add({
              ...emp,
              skills: emp.skills.filter((x) => x.skill !== data.id),
            });
          }
          break;
      }
    });
    this.empStore.registerAfterNativeTrigger((a: Activity<Employee>) => {
      if (!a.res.success) return;
      let data = a.res.data;
      let oData = a.original;
      switch (a.typ) {
        case DataAction.DELETE:
          for (let s of data.skills) {
            let skill = this.skillStore.get(s.skill);
            this.skillStore.add({
              ...skill,
              employees: skill.employees.filter((x) => x.employee !== data.id),
            });
          }
          break;
        case DataAction.EDIT:
          for (let s of oData!.skills) {
            if (data.skills.includes(s)) continue;
            let skill = this.skillStore.get(s.skill);
            this.skillStore.add({
              ...skill,
              employees: skill.employees.filter((x) => x.employee !== data.id),
            });
          }
          for (let s of data.skills) {
            if (oData!.skills.includes(s)) continue;
            let skill = this.skillStore.get(s.skill);
            this.skillStore.add({
              ...skill,
              employees: [...skill.employees, { ...s, employee: data.id }],
            });
          }
          break;
      }
    });
    this.forecastStore.registerAfterNativeTrigger((a: Activity<Forecast>) => {
      if (!a.res.success) return;
      let data = a.res.data;
      let sec = this.secStore.get(data.sector);
      switch (a.typ) {
        case DataAction.CREATE_NEW:
          this.secStore.add({
            ...sec,
            forecasts: [...sec.forecasts, data],
          });
          break;
        case DataAction.EDIT:
          this.secStore.add({
            ...sec,
            forecasts: sec.forecasts.map((x) => (x.id === data.id ? data : x)),
          });
          break;
        case DataAction.DELETE:
          this.secStore.add({
            ...sec,
            forecasts: sec.forecasts.filter((x) => x.id !== data.id),
          });
          break;
      }
    });
    this.empFileStore.registerAfterTrigger((a: Activity<EmpFile>) => {
      if (!a.res.success) return;
      let data = a.res.data;
      let emp = this.empStore.get(data.emp);
      switch (a.typ) {
        case DataAction.CREATE_NEW:
          this.empStore.add({
            ...emp,
            files: [...(emp.files ?? []), data],
          });
          break;
        case DataAction.DELETE:
          this.empStore.add({
            ...emp,
            files: emp.files?.filter((x) => x.id !== data.id),
          });
          break;
      }
    });
  };

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
      case DataType.EMP_FILE:
        return this.empFileStore;
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

  private _log = (desc: string) => {
    let sanitized = this.logger.flush();
    this.personalLogs = [
      ...this.personalLogs,
      { desc, time: new Date().getTime(), vals: sanitized },
    ];
    setMyLog(this.personalLogs);
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

  clearMyLog = () => {
    this.personalLogs = [];
    setMyLog([]);
  };

  private _saveNew = async (t: Item) => {
    let s = this.getStore2(t._type);
    if (!s) return { success: false, statusText: "", data: {} };
    return s.submitNew(t as never);
  };

  saveNew = async (t: Item) => {
    let a = await this._saveNew(t);
    this._log("Create");
    if (!this.soc) {
      this.refresh();
      this.trigger();
    }
    return a;
  };

  private _save = async (t: Item): Promise<SubmitResult<Item>> => {
    let s = this.getStore2(t._type);
    if (!s) return { success: false, statusText: "", data: {} };
    return s.submit(t as never);
  };

  save = async (t: Item): Promise<SubmitResult<Item>> => {
    let a = await this._save(t);
    this._log("Save");
    if (!this.soc) {
      this.refresh();
      this.trigger();
    }
    return a;
  };

  private _del = async (t: Item): Promise<SubmitResult<Item>> => {
    let s = this.getStore2(t._type);
    if (!s) return { success: false, statusText: "", data: {} };
    return s.remove(t as never);
  };

  del = async (t: Item) => {
    let a = await this._del(t);
    this._log("Delete");
    if (!this.soc) {
      this.refresh();
      this.trigger();
    }
    return a;
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
  getUser = async (): Promise<SubmitResult<User>> => {
    try {
      let res = await Fetcher.getUser();
      this.registerSocket();
      return { success: true, statusText: "", data: res.data };
    } catch (e) {
      return { success: false, statusText: "", data: {} };
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

  _submitExcel = async (type: ItemType, data: ExcelObj[], options?: any) => {
    let conv = this.objConverter;
    switch (type) {
      case ItemType.Sector:
        return Promise.all(
          conv
            .convObjsToSectors(data as SectorObj[])
            .map(this.secStore.submitOrNew)
        );
      case ItemType.Subsector:
        return Promise.all(
          conv
            .convObjsToSubsectors(data as SubsectorObj[])
            .map(this.subsecStore.submitOrNew)
        );
      case ItemType.Skill:
        return Promise.all(
          conv
            .convObjsToSkills(data as SkillObj[])
            .map(this.skillStore.submitOrNew)
        );
      case ItemType.Employee:
        return Promise.all(
          conv
            .convObjsToEmployees(data as EmployeeObj[])
            .map(this.empStore.submitOrNew)
        );
      case ItemType.Forecast:
        return Promise.all(
          conv
            .convObjsToForecasts(data as ForecastObj[], options)
            .map(this.forecastStore.submitOrNew)
        );
      case ItemType.CalEvent:
        return Promise.all(
          conv
            .convObjsToCalEvents(data as CalEventObj[])
            .map(this.calEventStore.submitOrNew)
        );
      default:
        return [];
    }
  };

  submitExcel = async (type: ItemType, data: ExcelObj[], options?: any) => {
    let res = await this._submitExcel(type, data, options);
    this._log(`Submit Excel for ${type}`);
    if (!this.soc) {
      this.refresh();
      this.trigger();
    }
    return res;
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

  calcHeadcountReq = (skill: Skill, forecast: number, month?: string) => {
    let workingDays = month ? this.cal.getDaysLeftInMonth(new Date(month)) : 27;
    return this.calc.calcHeadcountReq(
      skill,
      this.subsecStore.get(skill.subsector),
      forecast,
      workingDays
    );
  };

  delAllLog = Fetcher.deleteAllLog;

  genAssignment = (forecast: number, month?: string) => {
    let env = new AssignerEnv();
    let sArr = Object.values(this.skillStore.getLst());
    for (let s of sArr) {
      env.setJobReq(
        s.id,
        this.calcHeadcountReq(s, forecast, month),
        s.employees.map((x) => x.employee)
      );
    }
    let thiss = this;
    let h = new (class implements Heuristic {
      getScore = (j: number, e?: number) => {
        return 1 / (thiss.skillStore.get(j).employees.length + 1);
      };
    })();
    return new Assigner(env).getHeuristicAssignment(h);
  };
}

export type { Item, Kernel };
export default Kernel;
