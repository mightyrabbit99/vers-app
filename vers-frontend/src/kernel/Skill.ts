import { SkillData } from "./data";
import Fetcher from "./Fetcher";
import store, { Item, ItemType } from "./Store";

interface Skill extends Item {
  _type: ItemType.Skill;
  name: string;
  priority: number;
  percentageOfSector: number;
  subsector: number;
  employees: number[];
  jobs: number[];
}

function dataToObj(x: SkillData): Skill {
  return {
    id: x.id ?? -1,
    _type: ItemType.Skill,
    name: x.name,
    priority: x.priority,
    percentageOfSector: x.percentage_of_sector,
    subsector: x.subsector,
    employees: x.employees,
    jobs: x.jobs,
  };
}

function objToData(x: Skill): SkillData {
  return {
    id: x.id,
    name: x.name,
    priority: x.priority,
    percentage_of_sector: x.percentageOfSector,
    subsector: x.subsector,
    employees: x.employees,
    jobs: x.jobs,
  };
}

const generator = (init?: any): Skill => ({
  _type: ItemType.Skill,
  id: -1,
  name: "",
  priority: 0,
  percentageOfSector: 0,
  subsector: -1,
  employees: [],
  jobs: [],
  ...init,
});

const get = async () => {
  let res = await Fetcher.getSkills();
  return res.data.map(dataToObj);
};

const post = async (t: Skill) => {
  let res;
  try {
    res = await Fetcher.postSkill(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 201, statusText: res.statusText, data: dataToObj(res.data) };
};

const put = async (t: Skill) => {
  let res;
  try {
    res = await Fetcher.putSkill(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 200, statusText: res.statusText, data: dataToObj(res.data) };
};

const del = async (t: Skill) => {
  let res = await Fetcher.deleteSkill(objToData(t));
  return { success: res.status === 204, statusText: res.statusText, data: {} };
};

const hasher = (t: Skill) => t.name.trim().toLowerCase();

const SkillStore = store<Skill>(get, post, put, del, generator, dataToObj, hasher);

export type { Skill };
export default SkillStore;
