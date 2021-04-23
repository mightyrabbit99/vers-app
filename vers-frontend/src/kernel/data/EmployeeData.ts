import { Data } from "./Data";

interface EmpSkillData {
  skill: number;
  level: number;
  desc: string;
}

interface EmpFileData extends Data {
  emp: number;
  file: File | string;
  typ: 0;
  name: string;
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
  files?: EmpFileData[];
  profile_pic?: string;
}

interface EmpProfilePicData extends Data {
  emp: number;
  pic: File;
}

export type { EmployeeData, EmpSkillData, EmpFileData, EmpProfilePicData };
