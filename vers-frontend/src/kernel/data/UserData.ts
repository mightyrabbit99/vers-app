import { Data } from "./Data";

export enum AccessLevel {
  EDIT = 0,
  VIEW = 1,
  NONE = 2,
}

interface UserData extends Data {
  username: string;
  is_superuser: boolean;
  is_active: boolean;
  vers_user: {
    plant_group: AccessLevel;
    sector_group: AccessLevel;
    subsector_group: AccessLevel;
    employee_group: AccessLevel;
    job_group: AccessLevel;
    skill_group: AccessLevel;
    forecast_group: AccessLevel;
  };
}

export type { UserData };
