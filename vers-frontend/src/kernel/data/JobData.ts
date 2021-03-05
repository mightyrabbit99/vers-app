import { Data } from "./Data";

interface JobSkillData extends Data {
  skill: number;
  level: number;
}

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

export type { JobData, JobSkillData };
