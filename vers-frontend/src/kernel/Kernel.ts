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

import ExcelProcessor2, {
  EmployeeObj,
  ExcelObj,
  SectorObj,
  SkillObj,
  SubsectorObj,
  ForecastObj,
  CalEventObj,
} from "./ExcelProcessor2";
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

function genMap<T>(
  lst: { [id: number]: T },
  idMapper: (x: T) => any,
  filterer?: (x: T) => boolean
) {
  return Object.values(lst).reduce((prev, curr) => {
    if (filterer && !filterer(curr)) return prev;
    const newId = idMapper(curr);
    if (!prev[newId]) prev[newId] = [];
    prev[newId].push(curr);
    return prev;
  }, {} as { [name: string]: T[] });
}

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

  public trigger = () => {};
  private ti: NodeJS.Timeout | undefined;
  private triggerDamp = () => {
    if (this.ti) clearTimeout(this.ti);
    this.ti = setTimeout(this.trigger, epsTi);
  }


  public registerSocket = (soc?: WebSocket) => {
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

  public refresh = async (lst?: ItemType | ItemType[]) => {
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

  public clearLog = () => {
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

  public saveNew = async (t: Item) => {
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

  public save = async (t: Item): Promise<SubmitResult> => {
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

  public del = async (t: Item) => {
    let [mods, dels] = this.calcCascadeChanges(t);
    let logs = [];
    logs.push(...await Promise.all(mods.map((x) => this._save(x))));
    logs.push(...await Promise.all(dels.map((x) => this._del(x))));
    this._log("Delete", ...logs);
    if (!this.soc) {
      this.refresh();
      this.trigger();
    }
    return { success: logs.every(x => x.success) };
  };

  public login = async (
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

  public logout = () => {
    Fetcher.logout();
    if (this.soc) this.soc.close();
  };

  public isLoggedIn = Fetcher.isLoggedIn;
  public getUser = async (): Promise<SubmitResult> => {
    try {
      let res = await Fetcher.getUser();
      this.registerSocket();
      return { success: true, statusText: "", data: res.data };
    } catch (e) {
      return { success: false, statusText: "", data: null };
    }
  };

  public editUser = async (username: string, password: string) => {
    let res;
    try {
      res = await Fetcher.putUser(username, password);
    } catch (e) {
      res = e.response;
    }
    return { success: res.status === 200, data: res.data };
  };

  private saveSectorObjs = async (
    plantId: number,
    objs: SectorObj[]
  ): Promise<SubmitResult[]> => {
    let plant = this.plantStore.get(plantId);
    const saveObj = async (o: SectorObj) => {
      const st = this.secStore;
      if (o.plant !== plant.name) {
        return {
          success: false,
          statusText: `Line ${o.line}: Plant "${o.plant}" does not exist`,
          data: {
            _type: ItemType.Plant,
            plant: [`Line ${o.line}: Plant "${o.plant}" does not exist`],
          },
        };
      } else {
        return await st.submitOrNew(st.getNew({ ...o, plant: plantId }));
      }
    };
    return await Promise.all(objs.map(saveObj));
  };

  private saveSubsectorObjs = async (
    plantId: number,
    objs: SubsectorObj[]
  ): Promise<SubmitResult[]> => {
    let sectors = this.secStore.getLst((x) => x.plant === plantId);
    let secNames = genMap(sectors, (x) => x.name);
    const saveObj = async (o: SubsectorObj) => {
      const st = this.subsecStore;
      if (!(o.sector in secNames)) {
        return {
          success: false,
          statusText: `Line ${o.line}: Sector "${o.sector}" does not exist`,
          data: {
            _type: ItemType.Sector,
            sector: [`Line ${o.line}: Sector "${o.sector}" does not exist`],
          },
        };
      } else {
        return await st.submitOrNew(
          st.getNew({ ...o, sector: secNames[o.sector][0].id })
        );
      }
    };
    return await Promise.all(objs.map(saveObj));
  };

  private saveSkillObjs = async (
    plantId: number,
    objs: SkillObj[]
  ): Promise<SubmitResult[]> => {
    let sectors = this.secStore.getLst((x) => x.plant === plantId);
    let subsectors = this.subsecStore.getLst((x) => x.sector in sectors);
    let subsecNames = genMap(subsectors, (x) => x.name);
    const saveObj = async (o: SkillObj) => {
      const st = this.skillStore;
      if (!(o.subsector in subsecNames)) {
        return {
          success: false,
          statusText: `Line ${o.line}: Subsector "${o.subsector}" does not exist`,
          data: {
            _type: ItemType.Skill,
            subsector: [
              `Line ${o.line}: Subsector "${o.subsector}" does not exist`,
            ],
          },
        };
      } else {
        return await st.submitOrNew(
          st.getNew({ ...o, subsector: subsecNames[o.subsector][0].id })
        );
      }
    };
    return await Promise.all(objs.map(saveObj));
  };

  private saveEmpObjs = async (
    plantId: number,
    objs: EmployeeObj[]
  ): Promise<SubmitResult[]> => {
    let sectors = this.secStore.getLst((x) => x.plant === plantId);
    let subsectors = this.subsecStore.getLst((x) => x.sector in sectors);
    let skills = this.skillStore.getLst();
    let subsecNames = genMap(subsectors, (x) => x.name);
    let skillNames = genMap(skills, (x) => x.name);
    const saveObj = async (o: EmployeeObj) => {
      const st = this.empStore;
      if (!(o.homeLocation in subsecNames)) {
        return {
          success: false,
          statusText: `Line ${o.line}: Home Location (Subsector) "${o.homeLocation}" does not exist`,
          data: {
            _type: ItemType.Employee,
            subsector: [
              `Line ${o.line}: Home Location (Subsector) "${o.homeLocation}" does not exist`,
            ],
          },
        };
      }
      if (o.skills.some((x) => !(x.skillName in skillNames))) {
        return {
          success: false,
          statusText: "Skill not found",
          data: {
            _type: ItemType.Employee,
            skills: o.skills
              .filter((x) => !(x.skillName in skillNames))
              .map((x) => `Skill "${x.skillName}" not found`),
          },
        };
      }
      return await st.submitOrNew(
        st.getNew({
          ...o,
          subsector: subsecNames[o.homeLocation][0].id,
          skills: o.skills.map((x, idx) => ({
            skill: skillNames[o.skills[idx].skillName][0].id,
            level: x.level,
          })),
        })
      );
    };
    return await Promise.all(objs.map(saveObj));
  };

  private saveForecastObjs = async (
    objs: ForecastObj[]
  ): Promise<SubmitResult[]> => {
    const st = this.forecastStore;
    const saveObj = async (o: ForecastObj) => {
      return await st.submitOrNew(
        st.getNew({ ...o, on: new Date(o.on).toISOString().slice(0, 10) })
      );
    };
    return await Promise.all(objs.map(saveObj));
  };

  private saveCalEventObjs = async (
    objs: CalEventObj[]
  ): Promise<SubmitResult[]> => {
    const st = this.calEventStore;
    const saveObj = async (o: CalEventObj) => {
      return await st.submitOrNew(
        st.getNew({
          ...o,
          start: new Date(o.start).toISOString().slice(0, 10),
          end: new Date(o.end).toISOString().slice(0, 10),
        })
      );
    };
    return await Promise.all(objs.map(saveObj));
  };

  private _submitExcel = async (
    plantId: number,
    type: ItemType,
    objs: ExcelObj[]
  ): Promise<SubmitResult[] | undefined> => {
    switch (type) {
      case ItemType.Sector:
        return await this.saveSectorObjs(plantId, objs as SectorObj[]);
      case ItemType.Subsector:
        return await this.saveSubsectorObjs(plantId, objs as SubsectorObj[]);
      case ItemType.Skill:
        return await this.saveSkillObjs(plantId, objs as SkillObj[]);
      case ItemType.Employee:
        return await this.saveEmpObjs(plantId, objs as EmployeeObj[]);
      case ItemType.Forecast:
        return await this.saveForecastObjs(objs as ForecastObj[]);
      case ItemType.CalEvent:
        return await this.saveCalEventObjs(objs as CalEventObj[]);
    }
  };

  public submitExcel = async (
    plantId: number,
    type: ItemType,
    objs: ExcelObj[]
  ) => {
    let resLst = (await this._submitExcel(plantId, type, objs)) ?? [];
    this._log(`Submit Excel file for ${type}`, ...resLst);
    if (!this.soc) {
      this.refresh();
      this.trigger();
    }
    return resLst;
  };

  private genSectorExcel = async (items: Sector[]) => {
    const plants = this.plantStore.getLst();
    return await ExcelProcessor2.genSectorFile(
      items.map((x, idx) => ({ ...x, line: idx, plant: plants[x.plant].name }))
    );
  };

  private genSubsectorExcel = async (items: Subsector[]) => {
    const sectors = this.secStore.getLst();
    return await ExcelProcessor2.genSubsectorFile(
      items.map((x, idx) => ({
        ...x,
        line: idx,
        sector: sectors[x.sector].name,
      }))
    );
  };

  private genSkillExcel = async (items: Skill[]) => {
    const subsectors = this.subsecStore.getLst();
    return await ExcelProcessor2.genSkillFile(
      items.map((x, idx) => ({
        ...x,
        line: idx,
        subsector: subsectors[x.subsector].name,
      }))
    );
  };

  private genEmployeeExcel = async (items: Employee[]) => {
    const subsectors = this.subsecStore.getLst();
    const skills = this.skillStore.getLst();
    return await ExcelProcessor2.genEmployeeFile(
      items.map((x, idx) => ({
        ...x,
        line: idx,
        homeLocation: subsectors[x.subsector].name,
        skills: x.skills.map((y) => ({
          skillName: skills[y.skill].name,
          level: y.level,
        })),
      }))
    );
  };

  private genCalEventExcel = async (items: CalEvent[]) => {
    return await ExcelProcessor2.genCalEventFile(
      items.map((x, idx) => ({
        _type: x._type,
        line: idx,
        name: x.title,
        start: new Date(x.start).getTime(),
        end: new Date(x.end).getTime(),
        eventType: x.eventType,
      }))
    );
  };

  private genForecastExcel = async (items: Forecast[]) => {
    return await ExcelProcessor2.genForecastFile(
      items.map((x, idx) => ({
        _type: x._type,
        line: idx,
        on: new Date(x.on).getTime(),
        forecasts: x.forecasts,
      }))
    );
  };

  public getExcel = async (type: ItemType, items?: Item[]) => {
    if (!items) {
      switch (type) {
        case ItemType.Sector:
          items = Object.values(this.secStore.getLst());
          break;
        case ItemType.Subsector:
          items = Object.values(this.subsecStore.getLst());
          break;
        case ItemType.Skill:
          items = Object.values(this.skillStore.getLst());
          break;
        case ItemType.Employee:
          items = Object.values(this.empStore.getLst());
          break;
        case ItemType.CalEvent:
          items = Object.values(this.calEventStore.getLst());
          break;
        case ItemType.Forecast:
          items = Object.values(this.forecastStore.getLst());
          break;
        default:
          items = [];
      }
    }
    switch (type) {
      case ItemType.Sector:
        return await this.genSectorExcel(items as Sector[]);
      case ItemType.Subsector:
        return await this.genSubsectorExcel(items as Subsector[]);
      case ItemType.Skill:
        return await this.genSkillExcel(items as Skill[]);
      case ItemType.Employee:
        return await this.genEmployeeExcel(items as Employee[]);
      case ItemType.CalEvent:
        return await this.genCalEventExcel(items as CalEvent[]);
      case ItemType.Forecast:
        return await this.genForecastExcel(items as Forecast[]);
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
