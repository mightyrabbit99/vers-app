interface Data {
  id: number;
}

enum DataType {
  PLANT = 0,
  SECTOR = 1,
  SUBSECTOR = 2,
  SKILL = 3,
  DEPARTMENT = 4,
  EMPLOYEE = 5,
  JOB = 6,
  FORECAST = 7,
  CALEVENT = 8,
  LOG = 9,
  USER = 10,
}

export type { Data };
export { DataType };