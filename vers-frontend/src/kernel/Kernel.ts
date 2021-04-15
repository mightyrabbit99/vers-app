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

function k(...s: any[]) {
  return s.join("\t");
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
  };

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
    logs.push(...(await Promise.all(mods.map((x) => this._save(x)))));
    logs.push(...(await Promise.all(dels.map((x) => this._del(x)))));
    this._log("Delete", ...logs);
    if (!this.soc) {
      this.refresh();
      this.trigger();
    }
    return { success: logs.every((x) => x.success) };
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

  private convObjsToSectors = (objs: SectorObj[]): Sector[] => {
    const st = this.secStore;
    const plantMap = genMap(this.plantStore.getLst(), (x) => x.name);
    let f = (obj: SectorObj): Sector => {
      if (!(obj.plant && obj.plant in plantMap)) {
        throw new Error(
          `Line ${obj.line}: plant ${obj.plant} of sector ${obj.name} not defined`
        );
      }
      return st.getNew({
        plant: plantMap[obj.plant][0].id,
        name: obj.name,
        subsectors: [],
      });
    };
    return objs.map(f);
  };

  private convSectorsToObjs = (items: Sector[]): SectorObj[] => {
    let f = (item: Sector, idx: number): SectorObj => {
      return {
        _type: ItemType.Sector,
        line: idx,
        name: item.name,
        plant: this.plantStore.get(item.plant).name,
      };
    };
    return items.map(f);
  };

  private convObjsToSubsectors = (objs: SubsectorObj[]): Subsector[] => {
    const st = this.subsecStore;
    const plantMap = this.plantStore.getLst();
    const secMap = genMap(this.secStore.getLst(), (x) =>
      k(x.name, plantMap[x.plant].name)
    );
    let f = (obj: SubsectorObj): Subsector => {
      let kk = k(obj.sector.name, obj.sector.plant);
      if (!(kk in secMap)) {
        throw new Error(
          `Line ${obj.line}: Sector ${obj.sector.name} of subsector ${obj.name} not defined`
        );
      }
      return st.getNew({
        sector: secMap[kk][0].id,
        name: obj.name,
      });
    };
    return objs.map(f);
  };

  private convSubsectorsToObjs = (items: Subsector[]): SubsectorObj[] => {
    let f = (item: Subsector, idx: number): SubsectorObj => {
      return {
        _type: ItemType.Subsector,
        line: idx,
        name: item.name,
        sector: {
          _type: ItemType.Sector,
          line: idx,
          name: this.secStore.get(item.sector).name,
        },
      };
    };
    return items.map(f);
  };

  private convObjsToSkills = (objs: SkillObj[]): Skill[] => {
    const st = this.skillStore;
    const plantMap = this.plantStore.getLst();
    const secMap = this.secStore.getLst();
    const subsecMap = genMap(this.subsecStore.getLst(), (x) =>
      k(x.name, secMap[x.sector].name, plantMap[secMap[x.sector].plant].name)
    );
    let f = (obj: SkillObj): Skill => {
      let kk = k(
        obj.subsector.name,
        obj.subsector.sector.name,
        obj.subsector.sector.plant
      );
      if (!(kk in secMap)) {
        throw new Error(
          `Line ${obj.line}: Subsector ${obj.sector.name} of skill ${obj.name} not defined`
        );
      }
      return st.getNew({
        subsector: subsecMap[obj.sector.name][0].id,
        name: obj.name,
      });
    };
    return objs.map(f);
  };

  private convSkillsToObjs = (items: Skill[]): SkillObj[] => {
    let f = (item: Skill, idx: number): SkillObj => {
      let ss = this.subsecStore.get(item.subsector);
      let s = this.secStore.get(ss.sector);
      let p = this.plantStore.get(s.plant);
      return {
        _type: ItemType.Skill,
        line: idx,
        name: item.name,
        subsector: {
          _type: ItemType.Subsector,
          line: idx,
          name: ss.name,
          sector: {
            _type: ItemType.Sector,
            line: idx,
            name: s.name,
            plant: p.name,
          },
        },
      };
    };
    return items.map(f);
  };

  private pId: number = 0;
  setPid = (id: number) => {
    this.pId = id;
  };
  private convObjsToEmployees = (objs: EmployeeObj[]): Employee[] => {
    const st = this.empStore;
    const secMap = this.secStore.getLst((x) => x.plant === this.pId);
    const subsecMap = this.subsecStore.getLst((x) => x.sector in secMap);
    const subsecMap2 = genMap(subsecMap, (x) =>
      k(x.name, secMap[x.sector].name)
    );
    const skillMap = genMap(
      this.skillStore.getLst((x) => x.subsector in subsecMap),
      (x) =>
        k(
          x.name,
          subsecMap[x.subsector].name,
          secMap[subsecMap[x.subsector].sector].name
        )
    );
    let f = (obj: EmployeeObj): Employee => {
      let kk = k(obj.subsector.name, obj.subsector.sector.name);
      if (!(kk in subsecMap2)) {
        throw new Error(
          `Line ${obj.line}: Home Location (Subsector) ${obj.homeLocation} of employee ${obj.sesaId} not defined`
        );
      }
      return st.getNew({
        subsector: subsecMap2[kk][0].id,
        firstName: obj.firstName,
        lastName: obj.lastName,
        sesaId: obj.sesaId,
        hireDate: obj.joinDate.toISOString().slice(0, 10),
        department: obj.department,
        skills: obj.skills.map((sk) => {
          let kk = k(
            sk.skill.name,
            sk.skill.subsector.name,
            sk.skill.subsector.sector.name
          );
          if (!(kk in skillMap)) {
            throw new Error(
              `Col ${sk.skill.line}: Skill ${sk.skill.name} not defined`
            );
          }
          return {
            skill: skillMap[kk][0].id,
            level: sk.level,
            desc: "",
          };
        }),
      });
    };
    return objs.map(f);
  };

  private convEmployeesToObjs = (items: Employee[]): EmployeeObj[] => {
    let f = (item: Employee, idx: number): EmployeeObj => {
      let ss = this.subsecStore.get(item.subsector);
      let s = this.secStore.get(ss.sector);
      let p = this.plantStore.get(s.plant);
      return {
        _type: ItemType.Employee,
        line: idx,
        firstName: item.firstName,
        lastName: item.lastName,
        sesaId: item.sesaId,
        joinDate: new Date(item.hireDate),
        department: item.department,
        subsector: {
          _type: ItemType.Subsector,
          line: idx,
          name: ss.name,
          sector: {
            _type: ItemType.Sector,
            line: idx,
            name: s.name,
            plant: p.name,
          },
        },
        skills: item.skills.map((x) => {
          let sk = this.skillStore.get(x.skill);
          let suk = this.subsecStore.get(sk.subsector);
          let sek = this.secStore.get(suk.sector);
          return {
            skill: {
              _type: ItemType.Skill,
              line: idx,
              name: sk.name,
              subsector: {
                _type: ItemType.Subsector,
                line: idx,
                name: suk.name,
                sector: {
                  _type: ItemType.Sector,
                  line: idx,
                  name: sek.name,
                  plant: this.plantStore.get(sek.plant).name,
                },
              },
            },
            level: x.level,
          };
        }),
      };
    };
    return items.map(f);
  };

  submitExcel = (type: ItemType, data: ExcelObj[]) => {
    switch (type) {
      case ItemType.Sector:
        this.convObjsToSectors(data as SectorObj[]).forEach(
          this.secStore.submitOrNew
        );
        break;
      case ItemType.Subsector:
        this.convObjsToSubsectors(data as SubsectorObj[]).forEach(
          this.subsecStore.submitOrNew
        );
        break;
      case ItemType.Skill:
        this.convObjsToSkills(data as SkillObj[]).forEach(
          this.skillStore.submitOrNew
        );
        break;
      case ItemType.Employee:
        this.convObjsToEmployees(data as EmployeeObj[]).forEach(
          this.empStore.submitOrNew
        );
        break;
      default:
        break;
    }
  };

  getExcel = (type: ItemType, items?: Item[]) => {};

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
