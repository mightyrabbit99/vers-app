import { DepartmentData } from "./data";
import Fetcher from "./Fetcher";
import store, { Item, ItemType } from "./Store";

interface Department extends Item {
  _type: ItemType.Department;
  name: string;
  employees: number[];
}

function dataToObj(x: DepartmentData): Department {
  return {
    id: x.id ?? -1,
    _type: ItemType.Department,
    name: x.name,
    employees: x.employees,
  };
}

function objToData(x: Department): DepartmentData {
  return {
    id: x.id,
    name: x.name,
    employees: x.employees,
  };
}

const generator = (init?: any): Department => ({
  _type: ItemType.Department,
  id: -1,
  name: "",
  employees: [],
  ...init,
});

const get = async () => {
  let res = await Fetcher.getDepts();
  return res.data.map(dataToObj);
};

const post = async (t: Department) => {
  let res;
  try {
    res = await Fetcher.postDept(objToData(t));
  } catch (error) {
    res = error.response;
  }
  return { success: res.status === 201, data: dataToObj(res.data) };
};

const put = async (t: Department) => {
  let res;
  try {
    res = await Fetcher.putDept(objToData(t));
  } catch (error) {
    res = error.response;
  }
  return { success: res.status === 200, data: dataToObj(res.data) };
};

const del = async (t: Department) => {
  let res = await Fetcher.deleteDept(objToData(t));
  return { success: res.status === 204, data: {} };
};

const hasher = (t: Department) => t.name;

const DepartmentStore = store<Department>(get, post, put, del, generator, hasher);

export type { Department };
export default DepartmentStore;
