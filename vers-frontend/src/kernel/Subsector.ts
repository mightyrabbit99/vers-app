import { SubsectorData } from "./data";
import Fetcher from "./Fetcher";
import store, { Item, ItemType } from "./Store";

interface Subsector extends Item {
  _type: ItemType.Subsector;
  name: string;
  cycleTime: number;
  efficiency: number;
  unit?: string;
  sector: number;
  skills: number[];
  employees: number[];
  jobs: number[];
}

function dataToObj(x: SubsectorData): Subsector {
  return {
    id: x.id,
    _type: ItemType.Subsector,
    name: x.name,
    cycleTime: x.cycle_time,
    efficiency: x.efficiency,
    sector: x.sector,
    unit: x.unit,
    skills: x.skills,
    employees: x.employees,
    jobs: x.jobs,
  };
}

function objToData(x: Subsector): SubsectorData {
  return {
    id: x.id,
    name: x.name,
    sector: x.sector,
    cycle_time: x.cycleTime,
    efficiency: x.efficiency,
    unit: x.unit,
    skills: x.skills,
    employees: x.employees,
    jobs: x.jobs,
  };
}

const get = async () => {
  let res = await Fetcher.getSubsecs();
  if (res.headers['content-type'] !== "application/json") return [];
  return res.data.map(dataToObj);
};

const post = async (t: Subsector) => {
  let res;
  try {
    res = await Fetcher.postSubsec(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 201, statusText: res.statusText, data: dataToObj(res.data) };
};

const put = async (t: Subsector) => {
  let res;
  try {
    res = await Fetcher.putSubsec(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 200, statusText: res.statusText, data: dataToObj(res.data) };
};

const del = async (t: Subsector) => {
  let res = await Fetcher.deleteSubsec(objToData(t));
  return { success: res.status === 204, statusText: res.statusText, data: {} };
};

const generator = (init?: any): Subsector => ({
  _type: ItemType.Subsector,
  id: -1,
  name: "",
  sector: -1,
  cycleTime: 0,
  efficiency: 0,
  skills: [],
  employees: [],
  jobs: [],
  ...init,
});

const hasher = (t: Subsector) => t.name.trim().toLowerCase();

const SubsectorStore = store<Subsector>(get, post, put, del, generator, dataToObj, hasher);

export type { Subsector };
export default SubsectorStore;
