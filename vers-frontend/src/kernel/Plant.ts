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

const generator = (): Plant => ({
  _type: ItemType.Plant,
  id: -1,
  name: "",
  sectors: [],
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
    res = error.response;
  }
  return { success: res.status === 201, data: dataToObj(res.data) };
};

const put = async (t: Plant) => {
  let res;
  try {
    res = await Fetcher.putPlant(objToData(t));
  } catch (error) {
    res = error.response;
  }
  return { success: res.status === 200, data: dataToObj(res.data) };
};

const del = async (t: Plant) => {
  await Fetcher.deletePlant(objToData(t));
};

const PlantStore = store<Plant>(get, post, put, del, generator);

export type { Plant };
export default PlantStore;
