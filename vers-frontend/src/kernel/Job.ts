import { JobData, JobSkillData } from "./data";
import Fetcher from "./Fetcher";
import store, { ItemT, ItemType } from "./Store";

interface Job extends ItemT {
  _type: ItemType.Job;
  title: string;
  pplAmtRequired: number;
  salaryAmount: number;
  fromDate: string;
  toDate: string;
  subsector: number;
  empAssigned: number[];
  skillsRequired: JobSkillData[];
}
function dataToObj(x: JobData): Job {
  return {
    id: x.id,
    _type: ItemType.Job,
    title: x.title,
    pplAmtRequired: 0,
    salaryAmount: 0,
    fromDate: x.from_date,
    toDate: x.to_date,
    subsector: x.subsector,
    empAssigned: x.emp_assigned,
    skillsRequired: x.skills_required,
    non_field_errors: x.non_field_errors,
  };
}

function objToData(x: Job): JobData {
  return {
    id: x.id,
    title: x.title,
    ppl_amt_required: x.pplAmtRequired,
    salary_amount: x.salaryAmount,
    from_date: x.fromDate,
    to_date: x.toDate,
    subsector: x.subsector,
    emp_assigned: x.empAssigned,
    skills_required: x.skillsRequired,
  };
}

const get = async () => {
  let res = await Fetcher.getJobs();
  if (res.headers['content-type'] !== "application/json") return [];
  return res.data.map(dataToObj);
};

const post = async (t: Job) => {
  let res;
  try {
    res = await Fetcher.postJob(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 201, statusText: res.statusText, data: dataToObj(res.data) };
};

const put = async (t: Job) => {
  let res;
  try {
    res = await Fetcher.putJob(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 200, statusText: res.statusText, data: dataToObj(res.data) };
};

const del = async (t: Job) => {
  let res = await Fetcher.deleteJob(objToData(t));
  return { success: res.status === 204, statusText: res.statusText, data: t };
};

const generator = (init?: any): Job => ({
  id: -1,
  _type: ItemType.Job,
  title: "",
  pplAmtRequired: 0,
  salaryAmount: 0,
  fromDate: "",
  toDate: "",
  skillsRequired: [],
  empAssigned: [],
  subsector: -1,
  ...init,
});

const JobStore = store<Job>(get, post, put, del, generator, dataToObj);

export type { Job, JobSkillData };
export default JobStore;
