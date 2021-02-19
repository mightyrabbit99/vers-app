import { Data } from "./Data";
import { EmpSkillData } from "./EmpSkillData";
import { UserData } from "./UserData";

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

export type { EmployeeData };
