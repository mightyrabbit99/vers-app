import DepartmentStore, { Department } from "./Department";
import EmployeeStore, { Employee } from "./Employee";
import Fetcher from "./Fetcher";
import JobStore, { Job } from "./Job";
import PlantStore, { Plant } from "./Plant";
import SectorStore, { Sector } from "./Sector";
import SkillStore, { Skill } from "./Skill";
import { Store, Item, ItemType, Result as SubmitResult } from "./Store";
import SubsectorStore, { Subsector } from "./Subsector";
import ForecastStore, { Forecast } from "./Forecast";
import LogStore, { Log } from "./Log";
import CalEventStore, { CalEvent } from "./CalEvent";

import ExcelProcessor2, {
  EmployeeObj,
  ExcelObj,
  SectorObj,
  SkillObj,
  SubsectorObj,
} from "./ExcelProcessor2";

type Data = Plant | Sector | Subsector | Department | Skill | Employee | Job;

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

export interface MyLog {
  desc: string;
  time: number;
  vals: SubmitResult[];
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
  plantStore: Store<Plant>;
  secStore: Store<Sector>;
  subsecStore: Store<Subsector>;
  deptStore: Store<Department>;
  skillStore: Store<Skill>;
  empStore: Store<Employee>;
  jobStore: Store<Job>;
  forecastStore: Store<Forecast>;
  logStore: Store<Log>;
  calEventStore: Store<CalEvent>;
  personalLogs: MyLog[];

  constructor() {
    this.plantStore = new PlantStore();
    this.secStore = new SectorStore();
    this.subsecStore = new SubsectorStore();
    this.deptStore = new DepartmentStore();
    this.skillStore = new SkillStore();
    this.empStore = new EmployeeStore();
    this.jobStore = new JobStore();
    this.forecastStore = new ForecastStore();
    this.logStore = new LogStore();
    this.calEventStore = new CalEventStore();
    this.personalLogs = getMyLog();
  }

  private getStore = (t: ItemType) => {
    switch (t) {
      case ItemType.Plant:
        return this.plantStore;
      case ItemType.Sector:
        return this.secStore;
      case ItemType.Subsector:
        return this.subsecStore;
      case ItemType.Department:
        return this.deptStore;
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
    }
  };

  public refresh = async (lst?: ItemType | ItemType[]) => {
    if (!lst) lst = Object.values(ItemType);
    if (!(lst instanceof Array)) {
      lst = [lst];
    }
    await Promise.all(lst.map((x) => this.getStore(x)?.refresh()));
  };

  private _log = (desc: string, ...data: SubmitResult[]) => {
    this.personalLogs = [
      ...this.personalLogs,
      { desc, time: Date.now(), vals: data },
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
      case ItemType.Department:
        return await this.deptStore.submitNew(t as Department);
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
      case ItemType.Department:
        return await this.deptStore.submit(t as Department);
      case ItemType.Employee:
        return await this.empStore.submit(t as Employee);
      case ItemType.Job:
        return await this.jobStore.submit(t as Job);
      case ItemType.Forecast:
        return await this.forecastStore.submit(t as Forecast);
      case ItemType.CalEvent:
        return await this.calEventStore.submit(t as CalEvent);
      default:
        return { success: false, statusText: "", data: {} };
    }
  };

  public save = async (t: Item): Promise<SubmitResult> => {
    let a = await this._save(t);
    this._log("Save", a);
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
      case ItemType.Department:
        return await this.deptStore.remove(t as Department);
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
      default:
        return { success: false, statusText: "", data: {} };
    }
  };

  public del = async (t: Item): Promise<SubmitResult> => {
    let a = await this._del(t);
    this._log("Delete", a);
    return a;
  };

  public calcChanges = (payload: Data) => {
    let mods: Data[] = [],
      dels: Data[] = [];
    let sectors = this.secStore.getLst();
    let subsectors = this.subsecStore.getLst();
    let employees = this.empStore.getLst();
    let skills = this.skillStore.getLst();
    let jobs = this.jobStore.getLst();
    function cascadeDel(p: Data) {
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
        case ItemType.Department:
          (p as Department).employees
            .map((x) => employees[x])
            .forEach(cascadeDel);
          break;
      }
    }
    cascadeDel(payload);
    mods.reverse();
    dels.reverse();
    return [mods, dels];
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

  public logout = Fetcher.logout;
  public isLoggedIn = Fetcher.isLoggedIn;
  public getUser = async () => {
    try {
      let res = await Fetcher.getUser();
      return { success: true, data: res.data };
    } catch (e) {
      return { success: false };
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
          statusText: "",
          data: { plant: [`Line ${o.line}: Plant ${o.plant} does not exist`] },
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
          statusText: "",
          data: {
            sector: [`Line ${o.line}: Sector ${o.sector} does not exist`],
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
          statusText: "",
          data: {
            subsector: [
              `Line ${o.line}: Subsector ${o.subsector} does not exist`,
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
    let subsecNames = genMap(subsectors, (x) => x.name);
    const saveObj = async (o: EmployeeObj) => {
      const st = this.empStore;
      if (!(o.homeLocation in subsecNames)) {
        return {
          success: false,
          statusText: "",
          data: {
            subsector: [
              `Line ${o.line}: Home Location (Subsector) ${o.homeLocation} does not exist`,
            ],
          },
        };
      } else {
        return await st.submitOrNew(
          st.getNew({
            ...o,
            department: undefined, // TODO
            subsector: subsecNames[o.homeLocation][0].id,
          })
        );
      }
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
    }
  };

  public submitExcel = async (
    plantId: number,
    type: ItemType,
    objs: ExcelObj[]
  ) => {
    let resLst = (await this._submitExcel(plantId, type, objs)) ?? [];
    this._log(`Submit Excel file for ${type}`, ...resLst);
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
        start: x.start,
        end: x.end,
        eventType: x.eventType,
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
    }
  };
}

const k = new Kernel();
export type { Item, Data, Kernel };
export default k;
