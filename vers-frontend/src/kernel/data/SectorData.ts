import { Data } from "./Data";
import { ForecastData } from "./ForecastData";

interface SectorData extends Data {
  name: string;
  plant: number;
  subsectors: number[];
  forecasts: ForecastData[];
}

const empty: SectorData = {
  id: -1,
  name: "",
  plant: 0,
  subsectors: [],
  forecasts: [],
};

export type { SectorData };
export { empty as emptySectorData };
