import { Data, DataType } from "./Data";

enum LogType {
  CREATE,
  UPDATE,
  DELETE,
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
export { LogType };
