import { Data } from "./Data";

interface UserData extends Data {
  username: string;
  is_superuser: boolean;
  is_active: boolean;
  vers_user: {
    plant_group: number;
    sector_group: number;
    subsector_group: number;
    department_group: number;
    employee_group: number;
    job_group: number;
    skill_group: number;
  }
}

export type { UserData };