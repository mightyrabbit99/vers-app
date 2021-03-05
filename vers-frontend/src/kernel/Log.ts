import { LogData, LogType, DataType } from "./data";
import Fetcher from "./Fetcher";
import store, { Item, ItemType } from "./Store";

interface Log extends Item {
  _type: ItemType.Log;
  success?: boolean;
  type: LogType;
  user: number;
  dataType: DataType;
  timestamp: string;
  desc: string;
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
  return res.data.map(dataToObj);
};

const post = async (t: Log) => {
  return { success: true, data: t };
};

const put = async (t: Log) => {
  return { success: true, data: t };
};

const del = async (t: Log) => {
  let res = await Fetcher.deleteLog(objToData(t));
  return { success: res.status === 204, data: {} };
};

const generator = (init?: any): Log => ({
  _type: ItemType.Log,
  id: -1,
  type: LogType.CREATE,
  user: -1,
  dataType: DataType.DEPARTMENT,
  changeId: -1,
  timestamp: "",
  desc: "",
});

const LogStore = store<Log>(get, post, put, del, generator);

export type { Log };
export default LogStore;
