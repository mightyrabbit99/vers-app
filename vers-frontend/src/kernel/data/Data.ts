interface Data {
  id: number;
  non_field_errors?: string[];
}

enum DataType {
  PLANT = 0,
  SECTOR = 1,
  SUBSECTOR = 2,
  SKILL = 3,
  EMPLOYEE = 4,
  JOB = 5,
  FORECAST = 6,
  CALEVENT = 7,
  LOG = 8,
  USER = 9,
}

export type { Data };
export { DataType };