import { Data } from "./Data";

interface EmpSkillData extends Data {
  employee: number;
  skill: number;
  level: number;
  desc: string;
}

const empty: EmpSkillData = {
  id: -1,
  employee: 0,
  skill: 0,
  level: 0,
  desc: "",
}

export type { EmpSkillData };
export { empty as emptyEmpSkillData };
