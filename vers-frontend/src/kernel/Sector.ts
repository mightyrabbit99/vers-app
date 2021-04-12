import { SectorData } from "./data";
import Fetcher from "./Fetcher";
import store, { ItemT, ItemType } from "./Store";

interface Sector extends ItemT {
  _type: ItemType.Sector;
  name: string;
  plant: number;
  subsectors: number[];
}

function dataToObj(x: SectorData): Sector {
  return {
    id: x.id,
    _type: ItemType.Sector,
    name: x.name,
    plant: x.plant,
    subsectors: x.subsectors,
    non_field_errors: x.non_field_errors,
  };
}

function objToData(x: Sector): SectorData {
  return {
    id: x.id,
    name: x.name,
    plant: x.plant,
    subsectors: x.subsectors,
  };
}

const get = async () => {
  let res = await Fetcher.getSecs();
  if (res.headers['content-type'] !== "application/json") return [];
  return res.data.map(dataToObj);
};

const post = async (t: Sector) => {
  let res;
  try {
    res = await Fetcher.postSec(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 201, statusText: res.statusText, data: dataToObj(res.data) };
};

const put = async (t: Sector) => {
  let res;
  try {
    res = await Fetcher.putSec(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 200, statusText: res.statusText, data: dataToObj(res.data) };
};

const del = async (t: Sector) => {
  let res = await Fetcher.deleteSec(objToData(t));
  return { success: res.status === 204, statusText: res.statusText, data: {} };
};

const generator = (init?: any): Sector => ({
  _type: ItemType.Sector,
  id: -1,
  name: "",
  plant: -1,
  subsectors: [],
  ...init,
});

const hasher = (t: Sector) => t.name.trim().toLowerCase();

const SectorStore = store<Sector>(get, post, put, del, generator, dataToObj, hasher);


export type { Sector };
export default SectorStore;
