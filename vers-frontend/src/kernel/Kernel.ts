import DepartmentStore, { Department } from "./Department";
import EmployeeStore, { Employee } from "./Employee";
import Fetcher from "./Fetcher";
import JobStore, { Job } from "./Job";
import PlantStore, { Plant } from "./Plant";
import SectorStore, { Sector } from "./Sector";
import SkillStore, { Skill } from "./Skill";
import { Store, Item, ItemType } from "./Store";
import SubsectorStore, { Subsector } from "./Subsector";
import LogStore, { Log } from "./Log";

import ExcelProcessor2, {
  EmployeeObj,
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

class Kernel {
  plantStore: Store<Plant>;
  secStore: Store<Sector>;
  subsecStore: Store<Subsector>;
  deptStore: Store<Department>;
  skillStore: Store<Skill>;
  empStore: Store<Employee>;
  jobStore: Store<Job>;
  logStore: Store<Log>;

  constructor() {
    this.plantStore = new PlantStore();
    this.secStore = new SectorStore();
    this.subsecStore = new SubsectorStore();
    this.deptStore = new DepartmentStore();
    this.skillStore = new SkillStore();
    this.empStore = new EmployeeStore();
    this.jobStore = new JobStore();
    this.logStore = new LogStore();
  }

  public refresh = async () => {
    await this.plantStore.refresh();
    await this.secStore.refresh();
    await this.subsecStore.refresh();
    await this.deptStore.refresh();
    await this.skillStore.refresh();
    await this.empStore.refresh();
    await this.jobStore.refresh();
    await this.logStore.refresh();
  };

  public saveNew = async (t: Item) => {
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
      default:
        return { success: false, data: {} };
    }
  };

  public save = async (t: Item) => {
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
      default:
        return { success: false, data: {} };
    }
  };

  public del = async (t: Item) => {
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
      case ItemType.Log:
        return await this.logStore.remove(t as Log);
      default:
        return { success: false, data: {} };
    }
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
    for (let o of objs) {
      if (o.plant !== plant.name) continue;
      this.secStore.submitOrNew(this.secStore.getNew({ ...o, plant: plantId }));
    }
  };

  private saveSubsectorObjs = async (plantId: number, objs: SubsectorObj[]) => {
    let sectors = this.secStore.getLst((x) => x.plant === plantId);
    let secNames = genMap(sectors, (x) => x.name);
    for (let o of objs) {
      if (!(o.sector in secNames)) continue;
      this.subsecStore.submitOrNew(
        this.subsecStore.getNew({ ...o, sector: secNames[o.sector][0].id })
      );
    }
  };

  private saveSkillObjs = async (plantId: number, objs: SkillObj[]) => {
    let sectors = this.secStore.getLst((x) => x.plant === plantId);
    let subsectors = this.subsecStore.getLst((x) => x.sector in sectors);
    let subsecNames = genMap(subsectors, (x) => x.name);
    for (let o of objs) {
      if (!(o.subsector in subsecNames)) continue;
      this.skillStore.submitOrNew(
        this.skillStore.getNew({
          ...o,
          subsector: subsecNames[o.subsector][0].id,
        })
      );
    }
  };

  private saveEmpObjs = async (plantId: number, objs: EmployeeObj[]) => {
    let sectors = this.secStore.getLst((x) => x.plant === plantId);
    let subsectors = this.subsecStore.getLst((x) => x.sector in sectors);
    let subsecNames = genMap(subsectors, (x) => x.name);
    for (let o of objs) {
      if (!(o.homeLocation in subsecNames)) continue;
      this.empStore.submitOrNew(
        this.empStore.getNew({
          ...o,
          department: undefined, // TODO
          subsector: subsecNames[o.homeLocation][0].id,
        })
      );
    }
  };

  public submitExcel = async (plantId: number, type: ItemType, file: File) => {
    switch (type) {
      case ItemType.Sector:
        await this.saveSectorObjs(
          plantId,
          await ExcelProcessor2.readSectorFile(file)
        );
        break;
      case ItemType.Subsector:
        await this.saveSubsectorObjs(
          plantId,
          await ExcelProcessor2.readSubsectorFile(file)
        );
        break;
      case ItemType.Skill:
        await this.saveSkillObjs(
          plantId,
          await ExcelProcessor2.readSkillFile(file)
        );
        break;
      case ItemType.Employee:
        await this.saveEmpObjs(
          plantId,
          await ExcelProcessor2.readEmployeeFile(file)
        );
        break;
    }
  };

  private genSectorExcel = async (items: Sector[]) => {

  }

  private genSubsectorExcel = async (items: Subsector[]) => {

  }

  private genSkillExcel = async (items: Skill[]) => {

  }

  private genEmployeeExcel = async (items: Employee[]) => {
    
  }

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
