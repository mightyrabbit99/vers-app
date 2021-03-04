import { ForecastData } from "./data";
import store, { Item, ItemType } from "./Store";
import Fetcher from "./Fetcher";

interface Forecast extends Item {
  _type: ItemType.Forecast;
  on: string;
  vals: ForecastData[];
}

let c = 1;

const get = async () => {
  c = 1;
  let res = await Fetcher.getForecasts();
  let arranged = res.data.reduce((prev, curr) => {
    if (!prev[curr.on])
      prev[curr.on] = {
        _type: ItemType.Forecast,
        id: c++,
        on: curr.on,
        vals: [],
      };
    prev[curr.on].vals.push(curr);
    return prev;
  }, {} as { [on: string]: Forecast });
  return Object.values(arranged);
};

const post = async (t: Forecast) => {
  for (let v of t.vals) await Fetcher.postForecast(v);
  t.id = c++;
  return { success: true, data: t };
};

const put = async (t: Forecast) => {
  for (let v of t.vals) await Fetcher.putForecast(v);
  return { success: true, data: t };
};

const del = async (t: Forecast) => {
  for (let v of t.vals) await Fetcher.deleteForecast(v);
};

const generator = (init?: any): Forecast => ({
  id: -1,
  _type: ItemType.Forecast,
  on: "",
  vals: [],
});

const ForecastStore = store<Forecast>(get, post, put, del, generator);

export type { Forecast, ForecastData };
export default ForecastStore;
