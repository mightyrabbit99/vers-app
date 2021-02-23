import { SectorData } from "./data";
import Fetcher from "./Fetcher";
import store, { Item, ItemType } from "./Store";

interface Sector extends Item {
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
  return res.data.map(dataToObj);
};

const post = async (t: Sector) => {
  let res;
  try {
    res = await Fetcher.postSec(objToData(t));
  } catch (error) {
    res = error.response;
  }
  return { success: res.status === 201, data: dataToObj(res.data) };
};

const put = async (t: Sector) => {
  let res;
  try {
    res = await Fetcher.putSec(objToData(t));
  } catch (error) {
    res = error.response;
  }
  return { success: res.status === 200, data: dataToObj(res.data) };
};

const del = async (t: Sector) => {
  await Fetcher.deleteSec(objToData(t));
};

const generator = (init?: any): Sector => ({
  _type: ItemType.Sector,
  id: -1,
  name: "",
  plant: -1,
  subsectors: [],
  ...init,
});

const SectorStore = store<Sector>(get, post, put, del, generator);


export type { Sector };
export default SectorStore;
