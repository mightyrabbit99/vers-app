import { Data } from "./Data";

interface FData {
  n: number;
  val: number;
}

interface ForecastData extends Data {
  on: string;
  sector: number;
  forecasts: FData[];
}

export type { FData, ForecastData };
