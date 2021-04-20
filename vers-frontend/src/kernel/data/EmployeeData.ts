import { Data } from "./Data";

interface EmpSkillData {
  skill: number;
  level: number;
  desc: string;
}

interface EmployeeData extends Data {
  sesa_id: string;
  first_name: string;
  last_name: string;
  subsector: string;
  department: string;
  report_to?: number;
  skills: EmpSkillData[];
  available: boolean;
  birth_date?: string;
  gender: string;
  hire_date?: string;
  shift: number;
  files?: string[];
  profile_pic?: File | string;
}

interface EmpFileData extends Data {
  emp: number;
  file: File;
  typ: 0;
}

export type { EmployeeData, EmpSkillData, EmpFileData };
