import { Data } from "./Data";

enum ForecastType {
  INBOUND = 0,
  OUTBOUND = 1,
}

interface FData {
  n: number;
  val: number;
}

interface ForecastData extends Data {
  on: string;
  typ: ForecastType;
  forecasts: FData[];
}

export { ForecastType };
export type { FData, ForecastData };
