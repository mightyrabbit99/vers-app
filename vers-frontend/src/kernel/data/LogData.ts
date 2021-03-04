import { Data } from "./Data";

enum LogType {
  CREATE,
  EDIT,
  DELETE,
}

enum DataType {
  PLANT,
  SECTOR,
  SUBSECTOR,
  DEPARTMENT,
  EMPLOYEE,
  SKILL,
  JOB,
}

interface LogData extends Data {
  type: LogType;
  data_type: DataType;
  user: number;
  timestamp: string;
  desc: string;
}

export type { LogData };
export { LogType, DataType };
