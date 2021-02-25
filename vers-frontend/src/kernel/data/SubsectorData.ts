import { Data } from "./Data";

interface SubsectorData extends Data {
  name: string;
  sector: number;
  cycle_time: number;
  efficiency: number;
  unit?: string;
  skills: number[];
  employees: number[];
  jobs: number[];
}

const empty: SubsectorData = {
  id: -1,
  name: "",
  sector: 0,
  cycle_time: 0,
  efficiency: 0,
  skills: [],
  employees: [],
  jobs: [],
};

export type { SubsectorData };
export { empty as emptySubsectorData };
