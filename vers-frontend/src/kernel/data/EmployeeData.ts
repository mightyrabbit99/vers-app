import { Data } from "./Data";
import { UserData } from "./UserData";

interface EmpSkillData extends Data {
  skill: number;
  level: number;
  desc: string;
}

interface EmployeeData extends Data {
  sesa_id: string;
  first_name: string;
  last_name: string;
  subsector: number;
  department: number;
  report_to?: number;
  skills: EmpSkillData[];
  user: UserData;
  available: boolean;
  birth_date?: string;
  gender: string;
  hire_date?: string;
  profile_pic?: string | File;
}

export type { EmployeeData, EmpSkillData };
