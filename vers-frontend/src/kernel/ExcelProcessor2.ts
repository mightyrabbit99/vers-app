import Excel from "exceljs";
import { ItemType } from "./Store";

interface ExcelObjT {
  _type: ItemType;
  line: number;
  [name: string]: any;
}

interface PlantObj extends ExcelObjT {
  _type: ItemType.Plant;
  name: string;
}

interface SectorObj extends ExcelObjT {
  _type: ItemType.Sector;
  name: string;
  plant: string;
}

interface SubsectorObj extends ExcelObjT {
  _type: ItemType.Subsector;
  name: string;
  sector: string;
  unit?: string;
  cycleTime: number;
  efficiency: number;
}

interface SkillObj extends ExcelObjT {
  _type: ItemType.Skill;
  name: string;
  subsector: string;
  priority: number;
  percentageOfSector: number;
}

interface SkillMatrixObj {
  skillName: string;
  level: number;
}

interface EmployeeObj extends ExcelObjT {
  _type: ItemType.Employee;
  sesaId: string;
  firstName: string;
  lastName: string;
  homeLocation: string;
  skills: SkillMatrixObj[];
}

interface CalEventObj extends ExcelObjT {
  _type: ItemType.CalEvent;
  name: string;
  start: number;
  end: number;
  eventType: string;
}

interface ForecastObj extends ExcelObjT {
  _type: ItemType.Forecast;
  on: number;
  forecasts: { n: number; val: number }[];
}

type ExcelObj =
  | PlantObj
  | SectorObj
  | SubsectorObj
  | SkillObj
  | EmployeeObj
  | CalEventObj
  | ForecastObj;

type ValMap<T> = { [n: number]: T };
type CValMap = ValMap<Excel.CellValue>;

const checkRowSomeEmpty = (idxs: number[]) => (row: Excel.Row) => {
  const values: CValMap = row.values;
  return idxs.some((x) => !values[x] || `${values[x]}`.trim().length === 0);
};

const checkRowAllEmpty = (idxs: number[]) => (row: Excel.Row) => {
  const values: CValMap = row.values;
  return idxs.every((x) => !values[x] || `${values[x]}`.trim().length === 0);
};

const checkRowLegal = (fs: ValMap<(v: any) => boolean>) => (row: Excel.Row) => {
  const values: CValMap = row.values;
  return Object.entries(fs).every(([k, f]) => f(values[parseInt(k, 10)]));
};

const readEmployeeSheet = (ws: Excel.Worksheet): EmployeeObj[] => {
  let sets: { [homeLocation: string]: Set<string> } = {};
  let ans: EmployeeObj[] = [];

  function checkRow(row: Excel.Row) {
    return !checkRowSomeEmpty([1, 2, 3, 4, 5])(row);
  }
  function getSkillNames(row: Excel.Row) {
    let ans: { [i: number]: string } = [];
    for (let i = 6; row.getCell(i).value !== null; i++) {
      ans[i] = row.getCell(i).text.trim();
    }
    return ans;
  }
  const skillNames = getSkillNames(ws.getRow(1));

  let sesaId, firstName, lastName, homeLocation, department;
  ws.eachRow((row: Excel.Row, rowIndex) => {
    try {
      if (rowIndex === 1 || !checkRow(row)) return;
      const values: CValMap = row.values;
      [sesaId, firstName, lastName, homeLocation, department] = [1, 2, 3, 4, 5].map((x) =>
        `${values[x]}`.trim()
      );
      if (sesaId === "") return;

      if (!sets[homeLocation]) {
        sets[homeLocation] = new Set();
      }

      let s = sets[homeLocation];
      if (s.has(sesaId)) return;
      s.add(sesaId);
      ans.push({
        _type: ItemType.Employee,
        line: rowIndex,
        sesaId,
        firstName,
        lastName,
        homeLocation,
        department,
        skills: Object.entries(skillNames)
          .filter((x) => x[0] in row.values)
          .map((x) => ({
            skillName: x[1],
            level: parseInt(`${values[parseInt(x[0], 10)]}`, 10),
          })),
      });
    } catch (e) {
      throw new Error(`Error on employee sheet Row ${rowIndex}: ${e}`);
    }
  });
  return ans;
};

const readSkillSheet = (ws: Excel.Worksheet): SkillObj[] => {
  let ans: SkillObj[] = [];
  let name, subsector, priority, percentageOfSector;
  function checkRow(row: Excel.Row) {
    return !checkRowSomeEmpty([1, 2, 3, 4])(row);
  }
  ws.eachRow((row, rowIndex) => {
    try {
      if (rowIndex === 1 || !checkRow(row)) return;
      const values: CValMap = row.values;
      [name, subsector, priority, percentageOfSector] = [1, 2, 3, 4].map((x) =>
        `${values[x]}`.trim()
      );

      ans.push({
        _type: ItemType.Skill,
        line: rowIndex,
        name,
        subsector,
        priority: parseInt(priority, 10),
        percentageOfSector: parseInt(percentageOfSector, 10),
      });
    } catch (e) {
      throw new Error(`Error on skill sheet Row ${rowIndex}: ${e}`);
    }
  });
  return ans;
};

const readSubsectorSheet = (ws: Excel.Worksheet): SubsectorObj[] => {
  let ans: SubsectorObj[] = [];
  let name, sector, unit, cycleTime, efficiency;
  function checkRow(row: Excel.Row) {
    return !checkRowSomeEmpty([1, 2, 3, 4, 5])(row);
  }
  ws.eachRow((row, rowIndex) => {
    try {
      if (rowIndex === 1 || !checkRow(row)) return;
      const values: CValMap = row.values;
      [name, sector, unit, cycleTime, efficiency] = [1, 2, 3, 4, 5].map((x) =>
        `${values[x]}`.trim()
      );

      ans.push({
        _type: ItemType.Subsector,
        line: rowIndex,
        name,
        sector,
        unit,
        cycleTime: parseInt(cycleTime, 10),
        efficiency: parseInt(efficiency, 10),
      });
    } catch (e) {
      throw new Error(`Error on subsector sheet Row ${rowIndex}: ${e}`);
    }
  });
  return ans;
};

const readSectorSheet = (ws: Excel.Worksheet): SectorObj[] => {
  let ans: SectorObj[] = [];
  let name, plant;
  function checkRow(row: Excel.Row) {
    return !checkRowSomeEmpty([1, 2])(row);
  }
  ws.eachRow((row, rowIndex) => {
    try {
      if (rowIndex === 1 || !checkRow(row)) return;
      const values: CValMap = row.values;
      [name, plant] = [1, 2].map((x) => `${values[x]}`.trim());

      ans.push({
        _type: ItemType.Sector,
        line: rowIndex,
        name,
        plant,
      });
    } catch (e) {
      throw new Error(`Error on subsector sheet Row ${rowIndex}: ${e}`);
    }
  });
  return ans;
};

const readCalEventSheet = (ws: Excel.Worksheet): CalEventObj[] => {
  let ans: CalEventObj[] = [];
  let name, start, end, eventType;
  function checkRow(row: Excel.Row) {
    return !checkRowSomeEmpty([1, 2, 3, 4])(row);
  }
  ws.eachRow((row, rowIndex) => {
    if (rowIndex === 1 || !checkRow(row)) return;
    const values: CValMap = row.values;
    [name, eventType, start, end] = [1, 2, 3, 4].map((x) =>
      `${values[x]}`.trim()
    );

    ans.push({
      _type: ItemType.CalEvent,
      line: rowIndex,
      name,
      start: Date.parse(start),
      end: Date.parse(end),
      eventType,
    });
  });
  return ans;
};

const readForecastSheet = (ws: Excel.Worksheet): ForecastObj[] => {
  let ans: ForecastObj[] = [];
  let on: string, forecasts: string[];
  function checkRow(row: Excel.Row) {
    return (
      !checkRowSomeEmpty([1])(row) &&
      checkRowLegal({
        1: (s) => !isNaN(new Date(s).getTime()),
      })(row)
    );
  }
  ws.eachRow((row, rowIndex) => {
    if (rowIndex === 1 || !checkRow(row)) return;
    const values: CValMap = row.values;
    [on, ...forecasts] = [...Array(13).keys()]
      .map((x) => x + 1)
      .map((x) => `${values[x]}`.trim());
    ans.push({
      _type: ItemType.Forecast,
      line: rowIndex,
      on: Date.parse(on),
      forecasts: forecasts.map((x, idx) => ({
        n: idx + 1,
        val: isNaN(parseInt(x, 10)) ? 0 : parseInt(x, 10),
      })),
    });
  });
  return ans;
};

const readPlantProfile = (ws: Excel.Worksheet): ExcelObj[] => {
  let ans: ExcelObj[] = [];
  let pl: string, se: string, su: string, sk: string;
  let plant, sector, subsec, skill;
  function checkRow(row: Excel.Row) {
    return !checkRowAllEmpty([1, 2, 3, 4])(row);
  }
  ws.eachRow((row, rowIndex) => {
    if (rowIndex === 1 || !checkRow(row)) return;
    const values: CValMap = row.values;
    [plant = pl, sector = se, subsec = su, skill = sk] = [1, 2, 3, 4].map((x) =>
      `${values[x]}`.trim()
    );
    if (!(plant && sector && subsec && skill))
      throw new Error("Not enough info");
    if (plant !== pl) {
      ans.push({ _type: ItemType.Plant, name: plant, line: rowIndex });
      pl = plant;
    }
    if (sector !== se) {
      ans.push({ _type: ItemType.Sector, name: sector, line: rowIndex, plant });
      se = sector;
    }
  });
  return ans;
};

const employeeSheetWriter = (emps: EmployeeObj[]) => (ws: Excel.Worksheet) => {
  let skillSet = emps.reduce((prev, curr) => {
    curr.skills.forEach((x) => prev.add(x.skillName));
    return prev;
  }, new Set());
  ws.columns = [
    { header: "Sesa Id", key: "sesaId" },
    { header: "First Name", key: "firstName" },
    { header: "Last Name", key: "lastName" },
    { header: "Home Location", key: "homeLocation" },
    { header: "Department", key: "department" },
    ...[...skillSet].map((x) => ({ header: x, key: x })),
  ] as Excel.Column[];

  const genEmpCol = (emp: EmployeeObj) => {
    let { skills, ...rest } = emp;
    let sk = skills.reduce((prev, curr) => {
      prev[curr.skillName] = curr.level;
      return prev;
    }, {} as { [name: string]: number });
    return {
      ...rest,
      ...sk,
    };
  };

  ws.addRows(emps.map(genEmpCol));
};

const skillSheetWriter = (skills: SkillObj[]) => (ws: Excel.Worksheet) => {
  ws.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Subsector", key: "subsector" },
    { header: "Priority", key: "priority" },
    { header: "% of Sector", key: "percentageOfSector" },
  ] as Excel.Column[];

  ws.addRows(skills);
};

const subsectorSheetWriter = (subsectors: SubsectorObj[]) => (
  ws: Excel.Worksheet
) => {
  ws.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Sector", key: "sector" },
    { header: "Unit", key: "unit" },
    { header: "Cycle Time", key: "cycleTime" },
    { header: "Efficiency", key: "efficiency" },
  ] as Excel.Column[];

  ws.addRows(subsectors);
};

const sectorSheetWriter = (sectors: SectorObj[]) => (ws: Excel.Worksheet) => {
  ws.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Plant", key: "plant" },
  ] as Excel.Column[];

  ws.addRows(sectors);
};

const calEventSheetWriter = (calEvents: CalEventObj[]) => (
  ws: Excel.Worksheet
) => {
  ws.columns = [
    { header: "Start Date", key: "start" },
    { header: "End Date", key: "end" },
    { header: "Event", key: "name" },
    { header: "Event Type", key: "eventType" },
  ] as Excel.Column[];

  ws.addRows(
    calEvents.map((x) => ({
      ...x,
      start: new Date(x.start).toISOString().slice(0, 10),
      end: new Date(x.end).toISOString().slice(0, 10),
    }))
  );
};

const forecastSheetWriter = (forecasts: ForecastObj[]) => (
  ws: Excel.Worksheet
) => {
  let zwoelf = [...Array(12).keys()].map((x) => x + 1);
  ws.columns = [
    { header: "On", key: "on" },
    ...zwoelf.map((x) => ({ header: `n + ${x}`, key: x })),
  ] as Excel.Column[];

  ws.addRows(
    forecasts.map((fo) => ({
      on: new Date(fo.on).toISOString().slice(0, 7),
      ...fo.forecasts.reduce((pr, cu) => {
        pr[cu.n] = cu.val;
        return pr;
      }, {} as { [n: number]: number }),
    }))
  );
};

function readFile<T>(f: File, read: (ws: Excel.Worksheet) => T): Promise<T> {
  return new Promise((resolve, reject) => {
    const wb = new Excel.Workbook();
    const reader = new FileReader();

    reader.onload = async () => {
      const buffer = reader.result as ArrayBuffer;
      try {
        let x = await wb.xlsx.load(buffer);
        let sheet = x.getWorksheet("Sheet1");

        resolve(read(sheet));
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsArrayBuffer(f);
  });
}

async function genFile(...sheetWriters: Array<(ws: Excel.Worksheet) => void>) {
  const wb = new Excel.Workbook();
  wb.creator = "Me";
  wb.lastModifiedBy = "Her";
  wb.created = new Date();
  wb.modified = new Date();

  for (let i = 0; i < sheetWriters.length; i++) {
    const writer = sheetWriters[i];
    const sheet = wb.addWorksheet(`Sheet${i + 1}`);
    writer(sheet);
  }

  return await wb.xlsx.writeBuffer();
}

class ExcelProcessor2 {
  static readSectorFile = async (file: File) => {
    return await readFile(file, readSectorSheet);
  };
  static readSubsectorFile = async (file: File) => {
    return await readFile(file, readSubsectorSheet);
  };
  static readSkillFile = async (file: File) => {
    return await readFile(file, readSkillSheet);
  };
  static readEmployeeFile = async (file: File) => {
    return await readFile(file, readEmployeeSheet);
  };
  static readCalEventFile = async (file: File) => {
    return await readFile(file, readCalEventSheet);
  };
  static readForecastFile = async (file: File) => {
    return await readFile(file, readForecastSheet);
  };
  static readFile = async (type: ItemType, file: File) => {
    switch (type) {
      case ItemType.Sector:
        return await ExcelProcessor2.readSectorFile(file);
      case ItemType.Subsector:
        return await ExcelProcessor2.readSubsectorFile(file);
      case ItemType.Skill:
        return await ExcelProcessor2.readSkillFile(file);
      case ItemType.Employee:
        return await ExcelProcessor2.readEmployeeFile(file);
      case ItemType.CalEvent:
        return await ExcelProcessor2.readCalEventFile(file);
      case ItemType.Forecast:
        return await ExcelProcessor2.readForecastFile(file);
      default:
        return null;
    }
  };

  static readFile2 = async (file: File) => {
    return await readFile(file, readPlantProfile);
  };

  static genSectorFile = async (sectors: SectorObj[]) => {
    return await genFile(sectorSheetWriter(sectors));
  };

  static genSubsectorFile = async (subsectors: SubsectorObj[]) => {
    return await genFile(subsectorSheetWriter(subsectors));
  };

  static genSkillFile = async (skills: SkillObj[]) => {
    return await genFile(skillSheetWriter(skills));
  };

  static genEmployeeFile = async (emps: EmployeeObj[]) => {
    return await genFile(employeeSheetWriter(emps));
  };

  static genCalEventFile = async (calEvents: CalEventObj[]) => {
    return await genFile(calEventSheetWriter(calEvents));
  };

  static genForecastFile = async (forecasts: ForecastObj[]) => {
    return await genFile(forecastSheetWriter(forecasts));
  };

  static genFile = async (type: ItemType, objs: ExcelObj[]) => {
    switch (type) {
      case ItemType.Sector:
        return await ExcelProcessor2.genSectorFile(objs as SectorObj[]);
      case ItemType.Subsector:
        return await ExcelProcessor2.genSubsectorFile(objs as SubsectorObj[]);
      case ItemType.Skill:
        return await ExcelProcessor2.genSkillFile(objs as SkillObj[]);
      case ItemType.Employee:
        return await ExcelProcessor2.genEmployeeFile(objs as EmployeeObj[]);
      case ItemType.CalEvent:
        return await ExcelProcessor2.genCalEventFile(objs as CalEventObj[]);
      case ItemType.Forecast:
        return await ExcelProcessor2.genForecastFile(objs as ForecastObj[]);
      default:
        return null;
    }
  };
}

export type {
  ExcelObj,
  SectorObj,
  SubsectorObj,
  SkillObj,
  EmployeeObj,
  ForecastObj,
  CalEventObj,
};
export default ExcelProcessor2;
