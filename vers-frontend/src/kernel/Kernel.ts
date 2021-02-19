import DepartmentStore, { Department } from "./Department";
import EmployeeStore, { Employee } from "./Employee";
import Fetcher from "./Fetcher";
import JobStore, { Job } from "./Job";
import PlantStore, { Plant } from "./Plant";
import SectorStore, { Sector } from "./Sector";
import SkillStore, { Skill } from "./Skill";
import { Store, Item, ItemType } from "./Store";
import SubsectorStore, { Subsector } from "./Subsector";

type Data = Plant | Sector | Subsector | Department | Skill | Employee | Job;

class Kernel {
  plantStore: Store<Plant>;
  secStore: Store<Sector>;
  subsecStore: Store<Subsector>;
  deptStore: Store<Department>;
  skillStore: Store<Skill>;
  empStore: Store<Employee>;
  jobStore: Store<Job>;

  constructor() {
    this.plantStore = new PlantStore();
    this.secStore = new SectorStore();
    this.subsecStore = new SubsectorStore();
    this.deptStore = new DepartmentStore();
    this.skillStore = new SkillStore();
    this.empStore = new EmployeeStore();
    this.jobStore = new JobStore();
  }

  public refresh = async () => {
    await this.plantStore.refresh();
    await this.secStore.refresh();
    await this.subsecStore.refresh();
    await this.deptStore.refresh();
    await this.skillStore.refresh();
    await this.empStore.refresh();
    await this.jobStore.refresh();
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

  public login = async (username: string, password: string) => {
    try {
      let res = await Fetcher.login(username, password);
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
    try {
      let res = await Fetcher.putUser(username, password);
      return { success: res.status === 200, data: res.data };
    } catch (e) {
      return { success: false };
    }
  };
}

const k = new Kernel();
export type { Item, Data, Kernel };
export default k;
