import { Data } from "./Data";
import { JobSkillData } from "./JobSkillData";

interface JobData extends Data {
  title: string;
  ppl_amt_required: number;
  skills_required: JobSkillData[];
  salary_amount: number;
  emp_assigned: number[];
  from_date: string;
  to_date: string;
  subsector: number;
}

const empty: JobData = {
  id: -1,
  title: "",
  ppl_amt_required: 0,
  salary_amount: 0,
  from_date: "",
  to_date: "",
  skills_required: [],
  emp_assigned: [],
  subsector: -1,
};

export type { JobData };
export { empty as emptyJobData };
