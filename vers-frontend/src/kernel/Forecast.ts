import { ForecastData, FData } from "./data";
import store, { Item, ItemType } from "./Store";
import Fetcher from "./Fetcher";

interface Forecast extends Item {
  _type: ItemType.Forecast;
  on: string;
  forecasts: FData[];
}

function dataToObj(x: ForecastData): Forecast {
  return {
    ...x,
    id: x.id ?? -1,
    _type: ItemType.Forecast,
  };
}

function objToData(x: Forecast): ForecastData {
  return {
    ...x,
  };
}

const get = async () => {
  let res = await Fetcher.getForecasts();
  return res.data.map(dataToObj);
};

const post = async (t: Forecast) => {
  let res;
  try {
    res = await Fetcher.postForecast(objToData(t));
  } catch (error) {
    res = error.response;
  }
  return { success: res.status === 201, data: dataToObj(res.data) };
};

const put = async (t: Forecast) => {
  let res;
  try {
    res = await Fetcher.putForecast(objToData(t));
  } catch (error) {
    res = error.response;
  }
  return { success: res.status === 200, data: dataToObj(res.data) };
};

const del = async (t: Forecast) => {
  let res = await Fetcher.deleteForecast(objToData(t));
  return { success: res.status === 204, data: {} };
};

const generator = (init?: any): Forecast => ({
  id: -1,
  _type: ItemType.Forecast,
  on: "",
  forecasts: [1, 2, 3, 4, 5, 6].map((x) => ({
    id: -1,
    n: x,
    val: 0.0,
  })),
});

const ForecastStore = store<Forecast>(get, post, put, del, generator);

export type { Forecast, ForecastData };
export default ForecastStore;
