import { Data } from "./Data";

enum LogType {
  CREATE,
  UPDATE,
  DELETE,
}

enum DataType {
  PLANT,
  SECTOR,
  SUBSECTOR,
  SKILL,
  DEPARTMENT,
  EMPLOYEE,
  JOB,
  FORECAST,
}

interface LogData extends Data {
  type: LogType;
  data_type: DataType;
  user: number;
  timestamp: string;
  desc: {
    original?: any;
    data?: any;
  }
}

export type { LogData };
export { LogType, DataType };
