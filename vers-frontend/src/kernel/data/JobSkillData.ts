import { Data } from "./Data";

interface JobSkillData extends Data {
  job: number;
  skill: number;
  level: number;
}

const empty: JobSkillData = {
  id: -1,
  job: 0,
  skill: 0,
  level: 0,
}

export type { JobSkillData };
export { empty as emptyJobSkillData };
