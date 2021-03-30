import { DepartmentData } from "./data";
import Fetcher from "./Fetcher";
import store, { ItemT, ItemType } from "./Store";

interface Department extends ItemT {
  _type: ItemType.Department;
  name: string;
  employees: number[];
}

function dataToObj(x: DepartmentData): Department {
  return {
    id: x.id,
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
  if (res.headers['content-type'] !== "application/json") return [];
  return res.data.map(dataToObj);
};

const post = async (t: Department) => {
  let res;
  try {
    res = await Fetcher.postDept(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 201, statusText: res.statusText, data: dataToObj(res.data) };
};

const put = async (t: Department) => {
  let res;
  try {
    res = await Fetcher.putDept(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 200, statusText: res.statusText, data: dataToObj(res.data) };
};

const del = async (t: Department) => {
  let res = await Fetcher.deleteDept(objToData(t));
  return { success: res.status === 204, statusText: res.statusText, data: {} };
};

const hasher = (t: Department) => t.name;

const DepartmentStore = store<Department>(get, post, put, del, generator, dataToObj, hasher);

export type { Department };
export default DepartmentStore;
