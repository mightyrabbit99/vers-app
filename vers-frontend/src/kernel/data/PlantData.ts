import { Data } from "./Data";

interface PlantData extends Data {
  name: string;
  sectors: number[];
}

const empty: PlantData = {
  id: -1,
  name: "",
  sectors: [],
};

export type { PlantData };
export { empty as emptyPlantData };
