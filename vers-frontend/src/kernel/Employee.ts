import { EmployeeData, EmpSkillData } from "./data";
import { UserData } from "./data/UserData";
import Fetcher from "./Fetcher";
import store, { Item, ItemType } from "./Store";

interface Employee extends Item {
  _type: ItemType;
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
    birthDate: x.birth_date,
    reportTo: x.report_to ?? -1,
    gender: x.gender,
    hireDate: x.hire_date,
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
    birth_date: x.birthDate,
    report_to: x.reportTo === -1 ? undefined : x.reportTo,
    gender: x.gender,
    hire_date: x.hireDate,
    user: x.user,
  };
}

const get = async () => {
  let res = await Fetcher.getEmps();
  return res.data.map(dataToObj);
};

const post = async (t: Employee) => {
  let res;
  try {
    res = await Fetcher.postEmp(objToData(t));
  } catch (error) {
    res = error.response;
  }
  return { success: res.status === 201, data: dataToObj(res.data) };
};

const put = async (t: Employee) => {
  let res;
  try {
    res = await Fetcher.putEmp(objToData(t));
  } catch (error) {
    res = error.response;
  }
  return { success: res.status === 200, data: dataToObj(res.data) };
};

const del = async (t: Employee) => {
  await Fetcher.deleteEmp(objToData(t));
};

const generator = (): Employee => ({
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
  gender: "",
  hireDate: "",
  user: {
    id: -1,
    username: "",
    is_superuser: false,
    is_active: false,
    vers_user: {
      plant_group: 1,
      sector_group: 1,
      subsector_group: 1,
      department_group: 1,
      employee_group: 1,
      job_group: 1,
      skill_group: 1,
    }
  }
});

const EmployeeStore = store<Employee>(get, post, put, del, generator);

export type { Employee, EmpSkillData };
export default EmployeeStore;
