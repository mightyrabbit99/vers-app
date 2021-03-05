import { Data } from "./Data";

interface FData extends Data {
  n: number;
  val: number;
}

interface ForecastData extends Data {
  on: string;
  forecasts: FData[];
}

export type { FData, ForecastData };
