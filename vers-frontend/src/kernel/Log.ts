import { LogData, LogType, DataType } from "./data";
import Fetcher from "./Fetcher";
import store, { ItemT, ItemType } from "./Store";

interface Log extends ItemT {
  _type: ItemType.Log;
  success?: boolean;
  type: LogType;
  user: number;
  dataType: DataType;
  timestamp: string;
  desc: {
    original?: any;
    data?: any;
  };
}

function dataToObj(x: LogData): Log {
  return {
    id: x.id,
    _type: ItemType.Log,
    success: true,
    type: x.type,
    user: x.user,
    dataType: x.data_type,
    timestamp: x.timestamp,
    desc: x.desc,
    non_field_errors: x.non_field_errors,
  };
}

function objToData(x: Log): LogData {
  return {
    id: x.id,
    type: x.type,
    user: x.user,
    data_type: x.dataType,
    timestamp: x.timestamp,
    desc: x.desc,
  };
}

const get = async () => {
  let res = await Fetcher.getLogs();
  if (res.headers['content-type'] !== "application/json") return [];
  return res.data.map(dataToObj);
};

const post = async (t: Log) => {
  return { success: true, statusText: "Create", data: t };
};

const put = async (t: Log) => {
  return { success: true, statusText: "res.statusText", data: t };
};

const del = async (t: Log) => {
  let res = await Fetcher.deleteLog(objToData(t));
  return {
    success: res.status === 204,
    statusText: "",
    data: t,
  };
};

const generator = (init?: any): Log => ({
  _type: ItemType.Log,
  id: -1,
  type: LogType.CREATE,
  user: -1,
  dataType: DataType.EMPLOYEE,
  changeId: -1,
  timestamp: "",
  desc: {},
});

const LogStore = store<Log>(get, post, put, del, generator, dataToObj);

export type { Log };
export { LogType, DataType };
export default LogStore;
