import { Data } from "./Data";

interface SkillData extends Data {
  name: string;
  priority: number;
  percentage_of_subsector: number;
  subsector: number;
  employees: number[];
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

export type { SkillData };
export { empty as emptySkillData };
