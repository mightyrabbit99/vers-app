import { PlantData } from "./data";
import Fetcher from "./Fetcher";
import store, { Item, ItemType } from "./Store";

interface Plant extends Item {
  _type: ItemType.Plant;
  name: string;
  sectors: number[];
}

function dataToObj(x: PlantData): Plant {
  return {
    id: x.id ?? -1,
    _type: ItemType.Plant,
    name: x.name,
    sectors: x.sectors,
  };
}

function objToData(x: Plant): PlantData {
  return {
    id: x.id,
    name: x.name,
    sectors: x.sectors,
  };
}

const generator = (init?: any): Plant => ({
  _type: ItemType.Plant,
  id: -1,
  name: "",
  sectors: [],
  ...init,
});

const get = async () => {
  let res = await Fetcher.getPlants();
  return res.data.map(dataToObj);
};

const post = async (t: Plant) => {
  let res;
  try {
    res = await Fetcher.postPlant(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 201, statusText: res.statusText, data: dataToObj(res.data) };
};

const put = async (t: Plant) => {
  let res;
  try {
    res = await Fetcher.putPlant(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 200, statusText: res.statusText, data: dataToObj(res.data) };
};

const del = async (t: Plant) => {
  let res = await Fetcher.deletePlant(objToData(t));
  return { success: res.status === 204, statusText: res.statusText, data: {} };
};

const PlantStore = store<Plant>(get, post, put, del, generator);

export type { Plant };
export default PlantStore;
