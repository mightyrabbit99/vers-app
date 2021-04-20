import { EmployeeData, EmpSkillData } from "./data";
import Fetcher from "./Fetcher";
import store, { ItemT, ItemType } from "./Store";

interface Employee extends ItemT {
  _type: ItemType.Employee;
  sesaId: string;
  firstName: string;
  lastName: string;
  subsector: string;
  department: string;
  skills: EmpSkillData[];
  available: boolean;
  birthDate: string;
  reportTo: number;
  gender: string;
  hireDate: string;
  shift: number;
  profile_pic?: File | string;
  files?: string[];
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
    non_field_errors: x.non_field_errors,
    shift: x.shift,
    files: x.files,
    profile_pic: x.profile_pic,
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
    shift: x.shift,
    files: x.files,
    profile_pic: x.profile_pic instanceof File ? x.profile_pic : undefined,
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
  subsector: "",
  department: "",
  skills: [],
  available: true,
  reportTo: -1,
  birthDate: "",
  gender: "M",
  hireDate: "",
  ...init,
});

const hasher = (t: Employee) => t.sesaId.trim().toLowerCase();

const EmployeeStore = store<Employee>(get, post, put, del, generator, dataToObj, hasher);

export type { Employee, EmpSkillData };
export default EmployeeStore;
