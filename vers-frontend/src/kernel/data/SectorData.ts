import { Data } from "./Data";

interface SectorData extends Data {
  name: string;
  plant: number;
  subsectors: number[];
}

const empty: SectorData = {
  id: -1,
  name: "",
  plant: 0,
  subsectors: [],
};

export type { SectorData };
export { empty as emptySectorData };
