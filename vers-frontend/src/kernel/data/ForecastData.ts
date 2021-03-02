import { Data } from "./Data";

interface ForecastData extends Data {
  on: string;
  n: number;
  val: number;
}

export type { ForecastData };
