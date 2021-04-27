import { ForecastData, FData } from "./data";
import store, { ItemT, ItemType } from "./Store";
import Fetcher from "./Fetcher";

interface Forecast extends ItemT {
  _type: ItemType.Forecast;
  on: string;
  forecasts: FData[];
}

function dataToObj(x: ForecastData): Forecast {
  return {
    ...x,
    id: x.id ?? -1,
    _type: ItemType.Forecast,
    non_field_errors: x.non_field_errors,
  };
}

function objToData(x: Forecast): ForecastData {
  return {
    ...x,
  };
}

const get = async () => {
  let res = await Fetcher.getForecasts();
  if (res.headers["content-type"] !== "application/json") return [];
  return res.data.map(dataToObj);
};

const post = async (t: Forecast) => {
  let res;
  try {
    res = await Fetcher.postForecast(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return {
    success: res.status === 201,
    statusText: res.statusText,
    data: dataToObj(res.data),
  };
};

const put = async (t: Forecast) => {
  let res;
  try {
    res = await Fetcher.putForecast(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return {
    success: res.status === 200,
    statusText: res.statusText,
    data: dataToObj(res.data),
  };
};

const del = async (t: Forecast) => {
  let res = await Fetcher.deleteForecast(objToData(t));
  return { success: res.status === 204, statusText: res.statusText, data: {} };
};

const generator = (init?: Forecast): Forecast => {
  let forecasts =
    init?.forecasts?.reduce((pr: any, cu: any) => {
      pr[cu.n] = cu.val;
      return pr;
    }, {} as { [n: number]: number }) ?? {};
  return {
    id: -1,
    _type: ItemType.Forecast,
    on: init?.on ?? "",
    forecasts: [...new Array(13).keys()]
      .map((x, idx) => idx)
      .map((x) => ({
        n: x,
        val: forecasts[x] ?? 0.0,
      })),
  };
};

const hasher = (t: Forecast) => t.on;

const ForecastStore = store<Forecast>(
  get,
  post,
  put,
  del,
  generator,
  dataToObj,
  hasher
);

export type { Forecast, ForecastData };
export default ForecastStore;
