import DepartmentStore, { Department } from "./Department";
import EmployeeStore, { Employee } from "./Employee";
import Fetcher from "./Fetcher";
import JobStore, { Job } from "./Job";
import PlantStore, { Plant } from "./Plant";
import SectorStore, { Sector } from "./Sector";
import SkillStore, { Skill } from "./Skill";
import { Store, Item, ItemType } from "./Store";
import SubsectorStore, { Subsector } from "./Subsector";
import ForecastStore, { Forecast } from "./Forecast";
import LogStore, { Log } from "./Log";

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

interface SubmitResult {
  success: boolean;
  data: any;
}

export interface MyLog {
  desc: string;
  time: number;
  vals: SubmitResult[];
}

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
    this.personalLogs = [];
  }

  public refresh = async () => {
    await this.plantStore.refresh();
    await this.secStore.refresh();
    await this.subsecStore.refresh();
    await this.deptStore.refresh();
    await this.skillStore.refresh();
    await this.empStore.refresh();
    await this.jobStore.refresh();
    await this.forecastStore.refresh();
    await this.logStore.refresh();
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
      default:
        return { success: false, data: {} };
    }
  };

  public saveNew = async (t: Item) => {
    let newMyLog: MyLog = { desc: "Create", time: Date.now(), vals: [] };
    newMyLog.vals.push(await this._saveNew(t));
    this.personalLogs.push(newMyLog);
    return newMyLog.vals[0];
  };

  private _save = async (t: Item) => {
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
      default:
        return { success: false, data: {} };
    }
  };

  public save = async (t: Item) => {
    let newMyLog: MyLog = { desc: "Save", time: Date.now(), vals: [] };
    newMyLog.vals.push(await this._save(t));
    this.personalLogs.push(newMyLog);
    return newMyLog.vals[0];
  };

  private _del = async (t: Item) => {
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
      default:
        return { success: false, data: {} };
    }
  };

  public del = async (t: Item) => {
    let newMyLog: MyLog = { desc: "Delete", time: Date.now(), vals: [] };
    newMyLog.vals.push(await this._del(t));
    this.personalLogs.push(newMyLog);
    return newMyLog.vals[0];
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

  private saveSectorObjs = async (plantId: number, objs: SectorObj[]) => {
    let plant = this.plantStore.get(plantId);
    const saveObj = async (o: SectorObj) => {
      const st = this.secStore;
      if (o.plant !== plant.name) {
        return { success: false, data: { plant: ["Plant does not exist"] } };
      } else {
        return await st.submitOrNew(st.getNew({ ...o, plant: plantId }));
      }
    };
    return await Promise.all(objs.map(saveObj));
  };

  private saveSubsectorObjs = async (plantId: number, objs: SubsectorObj[]) => {
    let sectors = this.secStore.getLst((x) => x.plant === plantId);
    let secNames = genMap(sectors, (x) => x.name);
    const saveObj = async (o: SubsectorObj) => {
      const st = this.subsecStore;
      if (!(o.sector in secNames)) {
        return { success: false, data: { sector: ["Sector does not exist"] } };
      } else {
        return await st.submitOrNew(
          st.getNew({ ...o, sector: secNames[o.sector][0].id })
        );
      }
    };
    return await Promise.all(objs.map(saveObj));
  };

  private saveSkillObjs = async (plantId: number, objs: SkillObj[]) => {
    let sectors = this.secStore.getLst((x) => x.plant === plantId);
    let subsectors = this.subsecStore.getLst((x) => x.sector in sectors);
    let subsecNames = genMap(subsectors, (x) => x.name);
    const saveObj = async (o: SkillObj) => {
      const st = this.skillStore;
      if (!(o.subsector in subsecNames)) {
        return {
          success: false,
          data: { subsector: ["Subsector does not exist"] },
        };
      } else {
        return await st.submitOrNew(
          st.getNew({ ...o, subsector: subsecNames[o.subsector][0].id })
        );
      }
    };
    return await Promise.all(objs.map(saveObj));
  };

  private saveEmpObjs = async (plantId: number, objs: EmployeeObj[]) => {
    let sectors = this.secStore.getLst((x) => x.plant === plantId);
    let subsectors = this.subsecStore.getLst((x) => x.sector in sectors);
    let subsecNames = genMap(subsectors, (x) => x.name);
    const saveObj = async (o: EmployeeObj) => {
      const st = this.empStore;
      if (!(o.homeLocation in subsecNames)) {
        return {
          success: false,
          data: { subsector: ["Subsector does not exist"] },
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
  ) => {
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
    let newMyLog: MyLog = { desc: "Excel Submit", time: Date.now(), vals: [] };
    newMyLog.vals = (await this._submitExcel(plantId, type, objs)) ?? [];
    this.personalLogs.push(newMyLog);
    return newMyLog.vals;
  };

  private genSectorExcel = async (items: Sector[]) => {
    const plants = this.plantStore.getLst();
    return await ExcelProcessor2.genSectorFile(
      items.map((x) => ({ ...x, plant: plants[x.plant].name }))
    );
  };

  private genSubsectorExcel = async (items: Subsector[]) => {
    const sectors = this.secStore.getLst();
    return await ExcelProcessor2.genSubsectorFile(
      items.map((x) => ({
        ...x,
        sector: sectors[x.sector].name,
      }))
    );
  };

  private genSkillExcel = async (items: Skill[]) => {
    const subsectors = this.subsecStore.getLst();
    return await ExcelProcessor2.genSkillFile(
      items.map((x) => ({
        ...x,
        subsector: subsectors[x.subsector].name,
      }))
    );
  };

  private genEmployeeExcel = async (items: Employee[]) => {
    const subsectors = this.subsecStore.getLst();
    const skills = this.skillStore.getLst();
    return await ExcelProcessor2.genEmployeeFile(
      items.map((x) => ({
        ...x,
        homeLocation: subsectors[x.subsector].name,
        skills: x.skills.map((y) => ({
          skillName: skills[y.skill].name,
          level: y.level,
        })),
      }))
    );
  };

  public getExcel = async (type: ItemType, items: Item[]) => {
    switch (type) {
      case ItemType.Sector:
        return await this.genSectorExcel(items as Sector[]);
      case ItemType.Subsector:
        return await this.genSubsectorExcel(items as Subsector[]);
      case ItemType.Skill:
        return await this.genSkillExcel(items as Skill[]);
      case ItemType.Employee:
        return await this.genEmployeeExcel(items as Employee[]);
    }
  };
}

const k = new Kernel();
export type { Item, Data, Kernel };
export default k;
