import Excel from "exceljs";
import { ItemType } from "./Store";

interface ExcelObjT {
  _type: ItemType;
  line: number;
  [name: string]: any;
}

interface SectorObj extends ExcelObjT {
  _type: ItemType.Sector;
  name: string;
  plant?: string;
}

const emptySector: SectorObj = {
  _type: ItemType.Sector,
  line: 0,
  name: "",
};

interface SubsectorObj extends ExcelObjT {
  _type: ItemType.Subsector;
  name: string;
  sector: SectorObj;
  unit?: string;
  cycleTime?: number;
  efficiency?: number;
}

const emptySubsector: SubsectorObj = {
  _type: ItemType.Subsector,
  line: 0,
  name: "",
  sector: emptySector,
};

interface SkillObj extends ExcelObjT {
  _type: ItemType.Skill;
  name: string;
  subsector: SubsectorObj;
  priority?: number;
  percentageOfSector?: number;
}

interface SkillMatrixObj {
  skill: SkillObj;
  level: number;
}

interface EmployeeObj extends ExcelObjT {
  _type: ItemType.Employee;
  sesaId: string;
  firstName: string;
  lastName: string;
  homeLocation: string;
  department: string;
  joinDate: Date;
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
  | SectorObj
  | SubsectorObj
  | SkillObj
  | EmployeeObj
  | CalEventObj
  | ForecastObj;

type ValMap<T> = { [n: number]: T };
type CValMap = Excel.CellValue[];

const enm = (n: number) => [...Array(n).keys()].map((x) => x + 1);

const checkRowSomeEmpty = (idxs: number[]) => (row: Excel.Row) => {
  const values: CValMap = row.values as Excel.CellValue[];
  return idxs.some((x) => !values[x] || `${values[x]}`.trim().length === 0);
};

const checkRowAllEmpty = (idxs: number[]) => (row: Excel.Row) => {
  const values: CValMap = row.values as Excel.CellValue[];
  return idxs.every((x) => !values[x] || `${values[x]}`.trim().length === 0);
};

const checkRowLegal = (fs: ValMap<(v: any) => boolean>) => (row: Excel.Row) => {
  const values: CValMap = row.values as Excel.CellValue[];
  return Object.entries(fs).every(([k, f]) => f(values[parseInt(k, 10)]));
};

function checkSectorObj(o: SectorObj) {
  //TODO
}

function checkSubsectorObj(o: SubsectorObj) {
  return; //TODO
}

function checkEmpObj(o: EmployeeObj) {
  // TODO
}

function checkSkillObj(o: SkillObj) {
  // TODO
}

const readSectorSheet = (ws: Excel.Worksheet): SectorObj[] => {
  let ans: SectorObj[] = [];
  let plant, name;
  function checkRow(row: Excel.Row) {
    return !checkRowSomeEmpty([2])(row);
  }
  let lastPlant: string = "";
  ws.eachRow((row, rowIndex) => {
    try {
      if (rowIndex === 1 || !checkRow(row)) return;
      const values: CValMap = row.values as Excel.CellValue[];
      [plant, name] = [1, 2].map((x) => `${values[x]}`.trim());
      lastPlant = plant.length > 0 ? plant : lastPlant;
      if (!lastPlant) throw new Error("Plant not defined");
      const obj: SectorObj = {
        _type: ItemType.Sector,
        line: rowIndex,
        name,
        plant: lastPlant,
      };
      checkSectorObj(obj);
      ans.push(obj);
    } catch (e) {
      throw new Error(`Error on Sector sheet Row ${rowIndex}: ${e}`);
    }
  });
  return ans;
};

const readSubsectorSheet = (ws: Excel.Worksheet): SubsectorObj[] => {
  let ans: SubsectorObj[] = [];
  let plant, sector, name, unit, cycleTime, efficiency;
  function checkRow(row: Excel.Row) {
    return !checkRowSomeEmpty([3, 4, 5, 6])(row);
  }
  let lastSector: SectorObj;
  ws.eachRow((row, rowIndex) => {
    try {
      if (rowIndex === 1 || !checkRow(row)) return;
      const values: CValMap = row.values as Excel.CellValue[];
      [plant, sector, name, unit, cycleTime, efficiency] = [
        1,
        2,
        3,
        4,
        5,
      ].map((x) => `${values[x]}`.trim());
      if (plant.length > 0 || sector.length > 0) {
        lastSector = {
          _type: ItemType.Sector,
          line: rowIndex,
          name: sector.length > 0 ? sector : lastSector?.name,
          plant: plant.length > 0 ? plant : lastSector?.plant,
        };
      }
      let obj: SubsectorObj = {
        _type: ItemType.Subsector,
        line: rowIndex,
        name,
        sector: lastSector,
        unit,
        cycleTime: parseFloat(cycleTime),
        efficiency: parseInt(efficiency, 10),
      };
      checkSubsectorObj(obj);
      ans.push(obj);
    } catch (e) {
      throw new Error(`Error on subsector sheet Row ${rowIndex}: ${e}`);
    }
  });
  return ans;
};

const readSkillSheet = (ws: Excel.Worksheet): SkillObj[] => {
  let ans: SkillObj[] = [];
  let plant, sector, subsector, name, priority, percentageOfSubsector;
  function checkRow(row: Excel.Row) {
    return !checkRowAllEmpty([1, 2, 3, 4])(row);
  }
  let lastSector: SectorObj = emptySector,
    lastSubsector: SubsectorObj = emptySubsector;
  ws.eachRow((row, rowIndex) => {
    try {
      if (rowIndex === 1 || !checkRow(row)) return;
      const values: CValMap = row.values as Excel.CellValue[];
      [plant, sector, subsector, name, priority, percentageOfSubsector] = enm(
        6
      ).map((x) => `${values[x]}`.trim());
      if (plant.length > 0 || sector.length > 0) {
        lastSector = {
          _type: ItemType.Sector,
          line: rowIndex,
          plant: plant.length > 0 ? plant : lastSector?.plant,
          name: sector.length > 0 ? sector : lastSector?.name,
        };
      }
      if (subsector.length > 0) {
        lastSubsector = {
          _type: ItemType.Subsector,
          line: rowIndex,
          name: subsector.length > 0 ? subsector : lastSubsector?.name,
          sector: lastSector,
        };
      }
      let obj: SkillObj = {
        _type: ItemType.Skill,
        line: rowIndex,
        name,
        subsector: lastSubsector,
        priority: parseInt(priority, 10),
        percentageOfSector: parseInt(percentageOfSubsector, 10),
      };
      checkSkillObj(obj);
      ans.push(obj);
    } catch (e) {
      throw new Error(`Error on skill sheet Row ${rowIndex}: ${e}`);
    }
  });
  return ans;
};

const readEmployeeSheet = (ws: Excel.Worksheet): EmployeeObj[] => {
  function getSkillDict() {
    function checkEmpSkillCol(c: Excel.Column) {
      return `${c.values[3]}`.trim().length > 0;
    }
    let sector, subsec, name;
    let skillDict: { [i: number]: SkillObj } = {};
    let lastSector = emptySector,
      lastSubsector = emptySubsector;
    for (let i = 13; checkEmpSkillCol(ws.getColumn(i)); i++) {
      let c = ws.getColumn(i);
      [sector, subsec, name] = [1, 2, 3].map((x) => `${c.values[x]}`.trim());
      if (sector.length > 0) {
        lastSector = {
          _type: ItemType.Sector,
          line: i,
          name: sector ?? lastSector?.name,
        };
      }
      if (subsec.length > 0) {
        lastSubsector = {
          _type: ItemType.Subsector,
          line: i,
          name: subsec ?? lastSubsector?.name,
          sector: lastSector,
        };
      }

      skillDict[i] = {
        _type: ItemType.Skill,
        line: i,
        name,
        subsector: lastSubsector,
      };
    }
    return skillDict;
  }
  const skillDict = getSkillDict();
  let no,
    shift,
    sesa,
    firstName,
    lastName,
    jobCode,
    department,
    homeLocation,
    costType,
    contract,
    email,
    joinDate;
  function checkRow(row: Excel.Row) {
    return !checkRowSomeEmpty([3])(row);
  }
  let ans: EmployeeObj[] = [];
  ws.eachRow((row, rowIndex) => {
    try {
      if (rowIndex < 4 || !checkRow(row)) return;
      const values: CValMap = row.values as Excel.CellValue[];
      [
        no,
        shift,
        sesa,
        firstName,
        lastName,
        jobCode,
        department,
        homeLocation,
        costType,
        contract,
        email,
        joinDate,
      ] = enm(13).map((x) => values[x]);
      if (!(joinDate instanceof Date)) throw new Error("Join Date must be a date");
      let skills: SkillMatrixObj[] = [];
      for (let i = 13; i < values.length; i++) {
        let v = values[i];
        if (!v) continue;
        let vs = parseInt(`${v}`.trim());
        if (isNaN(vs) || vs > 4 || vs < 1) continue;
        skills.push({
          skill: skillDict[i],
          level: vs,
        });
      }
      let obj: EmployeeObj = {
        _type: ItemType.Employee,
        line: rowIndex,
        firstName: `${firstName}`.trim(),
        lastName: `${lastName}`.trim(),
        sesaId: `${sesa}`.trim(),
        homeLocation: `${homeLocation}`.trim(),
        department: `${department}`.trim(),
        skills,
        joinDate,
      };
      checkEmpObj(obj);
      ans.push(obj);
    } catch (e) {
      throw new Error(`Error on Employee Sheet Row ${rowIndex}: ${e}`);
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
    const values: CValMap = row.values as Excel.CellValue[];
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
    const values: CValMap = row.values as Excel.CellValue[];
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

const employeeSheetWriter = (emps: EmployeeObj[]) => (ws: Excel.Worksheet) => {
  let skillSet = emps.reduce((prev, curr) => {
    curr.skills.forEach((x) => prev.add(x.skill.name));
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
      prev[curr.skill.name] = curr.level;
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
