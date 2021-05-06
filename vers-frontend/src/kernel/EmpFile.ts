import { EmpFileData } from "./data";
import Fetcher from "./Fetcher";
import store, { ItemType } from "./Store";

interface EmpFile extends EmpFileData {
  _type: ItemType.EmpFile;
}

const dataToObj = (data: EmpFileData): EmpFile => ({
  _type: ItemType.EmpFile,
  ...data,
})

const get = async () => {
  return [];
};

const post = async (t: EmpFileData) => {
  let res;
  try {
    res = await Fetcher.postEmpFile(t);
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 201, statusText: res.statusText, data: dataToObj(res.data) };
};

const put = async (t: EmpFileData) => {
  let res;
  try {
    res = await Fetcher.putEmpFile(t);
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 200, statusText: res.statusText, data: dataToObj(res.data) };
};

const del = async (t: EmpFileData) => {
  let res = await Fetcher.deleteEmpFile(t);
  return { success: res.status === 204, statusText: res.statusText, data: dataToObj(t) };
};

const generator = (init?: any): EmpFile => ({
  id: -1,
  _type: ItemType.EmpFile,
  emp: -1,
  name: "",
  file: "",
});


const EmployeeStore = store<EmpFile>(get, post, put, del, generator);

export type { EmpFile };
export default EmployeeStore;
