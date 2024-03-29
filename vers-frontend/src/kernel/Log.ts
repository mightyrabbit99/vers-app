import { LogData, LogType, DataType } from "./data";
import Fetcher from "./Fetcher";
import store, { ItemT, ItemType } from "./Store";

interface Log extends ItemT {
  _type: ItemType.Log;
  success?: boolean;
  typ: LogType;
  user: number;
  dataType: DataType;
  dateStr: string;
  timeStr: string;
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
    typ: x.typ,
    user: x.user,
    dataType: x.data_type,
    dateStr: new Date(x.timestamp).toLocaleDateString("my-MS"),
    timeStr: new Date(x.timestamp).toLocaleTimeString("my-MS"),
    desc: x.desc,
    non_field_errors: x.non_field_errors,
  };
}

function objToData(x: Log): LogData {
  return {
    id: x.id,
    typ: x.typ,
    user: x.user,
    data_type: x.dataType,
    timestamp: "",
    desc: x.desc,
  };
}

const get = async () => {
  let res = await Fetcher.getLogs();
  if (res.headers["content-type"] !== "application/json") return [];
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
  typ: LogType.CREATE,
  user: -1,
  dataType: DataType.EMPLOYEE,
  dateStr: "",
  timeStr: "",
  desc: {},
});

const LogStore = store<Log>(get, post, put, del, generator, dataToObj);

export type { Log };
export { LogType, DataType };
export default LogStore;
