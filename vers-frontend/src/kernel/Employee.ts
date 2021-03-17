import { EmployeeData, EmpSkillData } from "./data";
import { UserData, AccessLevel } from "./data/UserData";
import Fetcher from "./Fetcher";
import store, { Item, ItemType } from "./Store";

interface Employee extends Item {
  _type: ItemType.Employee;
  sesaId: string;
  firstName: string;
  lastName: string;
  subsector: number;
  department: number;
  skills: EmpSkillData[];
  available: boolean;
  birthDate: string;
  reportTo: number;
  gender: string;
  hireDate: string;
  user: UserData;
}

function dataToObj(x: EmployeeData): Employee {
  return {
    id: x.id,
    sesaId: x.sesa_id,
    _type: ItemType.Employee,
    firstName: x.first_name,
    lastName: x.last_name,
    subsector: x.subsector,
    department: x.department,
    skills: x.skills,
    available: x.available,
    birthDate: x.birth_date ?? "",
    reportTo: x.report_to ?? -1,
    gender: x.gender,
    hireDate: x.hire_date ?? "",
    user: x.user,
  };
}

function objToData(x: Employee): EmployeeData {
  return {
    id: x.id,
    sesa_id: x.sesaId,
    first_name: x.firstName,
    last_name: x.lastName,
    subsector: x.subsector,
    department: x.department,
    skills: x.skills,
    available: x.available,
    birth_date: x.birthDate === "" ? undefined : x.birthDate,
    report_to: x.reportTo === -1 ? undefined : x.reportTo,
    gender: x.gender,
    hire_date: x.hireDate === "" ? undefined : x.hireDate,
    user: x.user,
  };
}

const get = async () => {
  let res = await Fetcher.getEmps();
  if (res.headers['content-type'] !== "application/json") return [];
  return res.data.map(dataToObj);
};

const post = async (t: Employee) => {
  let res;
  try {
    res = await Fetcher.postEmp(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 201, statusText: res.statusText, data: dataToObj(res.data) };
};

const put = async (t: Employee) => {
  let res;
  try {
    res = await Fetcher.putEmp(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 200, statusText: res.statusText, data: dataToObj(res.data) };
};

const del = async (t: Employee) => {
  let res = await Fetcher.deleteEmp(objToData(t));
  return { success: res.status === 204, statusText: res.statusText, data: {} };
};

const generator = (init?: any): Employee => ({
  id: -1,
  _type: ItemType.Employee,
  sesaId: "",
  firstName: "",
  lastName: "",
  subsector: -1,
  department: -1,
  skills: [],
  available: true,
  reportTo: -1,
  birthDate: "",
  gender: "M",
  hireDate: "",
  ...init,
  user: {
    id: -1,
    username: "",
    is_superuser: false,
    is_active: false,
    ...init?.user,
    vers_user: {
      plant_group: AccessLevel.NONE,
      sector_group: AccessLevel.NONE,
      subsector_group: AccessLevel.NONE,
      department_group: AccessLevel.NONE,
      employee_group: AccessLevel.NONE,
      job_group: AccessLevel.NONE,
      skill_group: AccessLevel.NONE,
      ...init?.user?.vers_user,
    }
  }
});

const hasher = (t: Employee) => t.sesaId.trim().toLowerCase();

const EmployeeStore = store<Employee>(get, post, put, del, generator, dataToObj, hasher);

export type { Employee, EmpSkillData };
export { AccessLevel };
export default EmployeeStore;
