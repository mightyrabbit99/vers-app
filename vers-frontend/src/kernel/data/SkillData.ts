import { Data } from "./Data";

interface SkillEmpData {
  employee: number;
  level: number;
  desc: string;
}

interface SkillData extends Data {
  name: string;
  priority: number;
  percentage_of_subsector: number;
  subsector: number;
  employees: SkillEmpData[];
  jobs: number[];
}

const empty: SkillData = {
  id: -1,
  name: "",
  priority: 1,
  percentage_of_subsector: 0,
  subsector: -1,
  employees: [],
  jobs: [],
}

export type { SkillEmpData, SkillData };
export { empty as emptySkillData };
