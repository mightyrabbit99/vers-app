import { Data } from "./Data";

interface DepartmentData extends Data {
  name: string;
  employees: number[];
}

const empty: DepartmentData = {
  id: -1,
  name: "",
  employees: [],
};

export type { DepartmentData };
export { empty as emptyDepartmentData };
