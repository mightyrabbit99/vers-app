import DepartmentStore, { Department } from "./Department";
import EmployeeStore, { Employee } from "./Employee";
import Fetcher from "./Fetcher";
import JobStore, { Job } from "./Job";
import PlantStore, { Plant } from "./Plant";
import SectorStore, { Sector } from "./Sector";
import SkillStore, { Skill } from "./Skill";
import { Store, Item, ItemType } from "./Store";
import SubsectorStore, { Subsector } from "./Subsector";

import ExcelProcessor, {
  DepartmentObj,
  SectorObj,
  SubsectorObj,
  SkillObj,
  EmployeeObj,
} from "src/kernel/ExcelProcessor";

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

  private saveExcelDatas = async (
    plantId: number,
    sectors: SectorObj[],
    departments: DepartmentObj[]
  ) => {
    let sectorLst = k.secStore.getLst((x) => x.plant === plantId);
    let subsectorLst = k.subsecStore.getLst((x) => x.sector in sectorLst);
    let employeeLst = k.empStore.getLst((x) => x.subsector in subsectorLst);

    let sectorNameMap = genMap(sectorLst, (x) => x.name);
    let subsectorNameMap = genMap(subsectorLst, (x) => x.name);
    let empSesaMap = genMap(employeeLst, (x) => x.sesaId);

    const saveSkill = async (skill: SkillObj) => {
      if (skill.data.name in subsectorNameMap) {
        let origin = subsectorNameMap[skill.data.name][0];
        Object.assign(origin, skill.data);
        await k.save(origin);
        skill.id = origin.id;
      } else {
        let res = await this.saveNew(k.skillStore.getNew(skill.data));
        skill.id = res.data.id;
      }
    };
    const saveEmployee = async (emp: EmployeeObj) => {
      if (emp.data.sesaId in empSesaMap) {
        let origin = empSesaMap[emp.data.sesaId][0];
        Object.assign(origin, emp.data);
        await k.save(origin);
        emp.id = origin.id;
      } else {
        let res = await this.saveNew(k.empStore.getNew(emp.data));
        emp.id = res.data.id;
      }
    };
    const performSaveSubsector = async (subsec: SubsectorObj) => {
      if (subsec.data.name in subsectorNameMap) {
        let origin = subsectorNameMap[subsec.data.name][0];
        Object.assign(origin, subsec.data);
        await this.save(origin);
        subsec.id = origin.id;
      } else {
        let res = await this.saveNew(k.subsecStore.getNew(subsec.data));
        subsec.id = res.data.id;
      }
      subsec.skills.forEach((x) => (x.data.subsector = subsec.id));
      subsec.employees.forEach((x) => (x.data.subsector = subsec.id));
    };
    const saveSubsector = async (subsec: SubsectorObj) => {
      await performSaveSubsector(subsec);
      for (let skill of subsec.skills) {
        await saveSkill(skill);
      }
      for (let emp of subsec.employees) {
        await saveEmployee(emp);
      }
    };
    const performSaveSector = async (sec: SectorObj) => {
      if (sec.data.name in sectorNameMap) {
        let origin = sectorNameMap[sec.data.name][0];
        Object.assign(origin, sec.data);
        await this.save(origin);
        sec.id = origin.id;
      } else {
        let res = await this.saveNew(
          k.secStore.getNew({ ...sec.data, plant: plantId })
        );
        sec.id = res.data.id;
      }
      sec.subsectors.forEach((x) => (x.data.sector = sec.id));
    };
    const saveSector = async (sec: SectorObj) => {
      await performSaveSector(sec);
      for (let subsec of sec.subsectors) {
        await saveSubsector(subsec);
      }
    };
    const performSaveDept = async (dept: DepartmentObj) => {};
    const saveDept = async (dept: DepartmentObj) => {
      await performSaveDept(dept);
      for (let emp of dept.employees) {
        await saveEmployee(emp);
      }
    };
    for (let sec of sectors) {
      await saveSector(sec);
    }
    for (let dept of departments) {
      await saveDept(dept);
    }
  };

  public submitExcel = async (plantId: number, file: File) => {
    let { sectors, departments } = await ExcelProcessor.readFile(file);
    this.saveExcelDatas(plantId, sectors, departments);
  };
}

const k = new Kernel();
export type { Item, Data, Kernel };
export default k;
