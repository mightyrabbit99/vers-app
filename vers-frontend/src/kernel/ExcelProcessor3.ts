import Excel from "exceljs";
import { CalEvent } from "./CalEvent";
import { Employee } from "./Employee";
import { Forecast } from "./Forecast";
import { Plant } from "./Plant";
import { Sector } from "./Sector";
import { Skill } from "./Skill";
import { ItemType, Store } from "./Store";
import { Subsector } from "./Subsector";

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
  percentageOfSubsector?: number;
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
  subsector: string;
  department: string;
  joinDate?: Date;
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

const checkColAllEmpty = (idxs: number[]) => (col: Excel.Column) => {
  const values: CValMap = col.values as Excel.CellValue[];
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
  if (o.sesaId === "") throw new Error("SESA ID must be defined");
  if (!/^SESA.*/.test(o.sesaId.toUpperCase()))
    throw new Error(`SESA ID "${o.sesaId}" invalid`);
  if (!(o.joinDate instanceof Date)) o.joinDate = undefined;
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
      [plant, name] = [1, 2].map((x) =>
        values[x] ? `${values[x]}`.trim() : ""
      );
      if (name.length === 0) return;
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
        6,
      ].map((x) => (values[x] ? `${values[x]}`.trim() : ""));
      if (name.length === 0) return;
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
        cycleTime: isNaN(parseFloat(cycleTime)) ? 0.0 : parseFloat(cycleTime),
        efficiency: isNaN(parseInt(efficiency, 10)) ? 0 : parseInt(efficiency),
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
      ).map((x) => (values[x] ? `${values[x]}`.trim() : ""));
      if (name.length === 0) return;
      if (plant.length > 0 || sector.length > 0) {
        lastSector = {
          _type: ItemType.Sector,
          line: rowIndex,
          plant: plant.length > 0 ? plant : lastSector.plant,
          name: sector.length > 0 ? sector : lastSector.name,
        };
      }
      if (subsector.length > 0) {
        lastSubsector = {
          _type: ItemType.Subsector,
          line: rowIndex,
          name: subsector.length > 0 ? subsector : lastSubsector.name,
          sector: lastSector,
        };
      }
      if (lastSector === emptySector || lastSubsector === emptySubsector)
        return;
      let obj: SkillObj = {
        _type: ItemType.Skill,
        line: rowIndex,
        name,
        subsector: lastSubsector,
        priority: isNaN(parseInt(priority, 10)) ? 1 : parseInt(priority, 10),
        percentageOfSubsector: isNaN(parseInt(percentageOfSubsector, 10))
          ? 0
          : parseInt(percentageOfSubsector, 10),
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
      return !checkColAllEmpty([1, 2, 3])(c);
    }
    let sector, subsec, name;
    let skillDict: { [i: number]: SkillObj } = {};
    let lastSector = emptySector,
      lastSubsector = emptySubsector;
    for (let i = 13; checkEmpSkillCol(ws.getColumn(i)); i++) {
      let c = ws.getColumn(i);
      [sector, subsec, name] = [1, 2, 3].map((x) =>
        c.values[x] ? `${c.values[x]}`.trim() : ""
      );
      if (name.length === 0) continue;
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
    subsector,
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
        subsector,
        costType,
        contract,
        email,
        joinDate,
      ] = enm(13).map((x) => values[x]);
      if (!(joinDate instanceof Date)) joinDate = undefined;
      let skills: SkillMatrixObj[] = [];
      for (let i = 13; i < values.length; i++) {
        let v = values[i];
        if (!v) continue;
        if (!skillDict[i]) continue;
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
        firstName: firstName ? `${firstName}`.trim() : "",
        lastName: lastName ? `${lastName}`.trim() : "",
        sesaId: sesa ? `${sesa}`.trim() : "",
        subsector: subsector ? `${subsector}`.trim() : "",
        department: department ? `${department}`.trim() : "",
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
    { header: "Home Location", key: "subsector" },
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
    { header: "% of Sector", key: "percentageOfSubsector" },
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

async function readBuffer<T>(
  b: Buffer,
  read: (ws: Excel.Worksheet) => T
): Promise<T> {
  return new Promise(async (res, rej) => {
    try {
      const wb = new Excel.Workbook();
      const r = await wb.xlsx.load(b);
      let sheet = r.getWorksheet("Sheet1");
      res(read(sheet));
    } catch (e) {
      rej(e);
    }
  });
}

async function readFile<T>(
  f: File,
  read: (ws: Excel.Worksheet) => T
): Promise<T> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const buffer = reader.result as Buffer;
      try {
        res(await readBuffer(buffer, read));
      } catch (e) {
        rej(e);
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

class ExcelProcessor3 {
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
  static readBuffer = async (type: ItemType, buffer: Buffer) => {
    switch (type) {
      case ItemType.Sector:
        return await readBuffer(buffer, readSectorSheet);
      case ItemType.Subsector:
        return await readBuffer(buffer, readSubsectorSheet);
      case ItemType.Skill:
        return await readBuffer(buffer, readSkillSheet);
      case ItemType.Employee:
        return await readBuffer(buffer, readEmployeeSheet);
      case ItemType.CalEvent:
        return await readBuffer(buffer, readCalEventSheet);
      case ItemType.Forecast:
        return await readBuffer(buffer, readForecastSheet);
      default:
        return [];
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
        return await ExcelProcessor3.genSectorFile(objs as SectorObj[]);
      case ItemType.Subsector:
        return await ExcelProcessor3.genSubsectorFile(objs as SubsectorObj[]);
      case ItemType.Skill:
        return await ExcelProcessor3.genSkillFile(objs as SkillObj[]);
      case ItemType.Employee:
        return await ExcelProcessor3.genEmployeeFile(objs as EmployeeObj[]);
      case ItemType.CalEvent:
        return await ExcelProcessor3.genCalEventFile(objs as CalEventObj[]);
      case ItemType.Forecast:
        return await ExcelProcessor3.genForecastFile(objs as ForecastObj[]);
      default:
        return null;
    }
  };
}

function genMap<T>(
  lst: { [id: number]: T },
  idMapper: (x: T) => any,
  filterer?: (x: T) => boolean
) {
  return Object.values(lst).reduce((prev, curr) => {
    if (filterer && !filterer(curr)) return prev;
    const newId = idMapper(curr);
    if (!prev[newId]) prev[newId] = [];
    prev[newId].push(curr);
    return prev;
  }, {} as { [name: string]: T[] });
}

function k(...s: any[]) {
  return s.join("\t");
}

class ExcelObjConverter {
  private plantStore: Store<Plant>;
  private secStore: Store<Sector>;
  private subsecStore: Store<Subsector>;
  private skillStore: Store<Skill>;
  private empStore: Store<Employee>;
  private forecastStore: Store<Forecast>;
  private calEventStore: Store<CalEvent>;

  constructor(
    plantStore: Store<Plant>,
    secStore: Store<Sector>,
    subsecStore: Store<Subsector>,
    skillStore: Store<Skill>,
    empStore: Store<Employee>,
    forecastStore: Store<Forecast>,
    calEventStore: Store<CalEvent>
  ) {
    this.plantStore = plantStore;
    this.secStore = secStore;
    this.subsecStore = subsecStore;
    this.skillStore = skillStore;
    this.empStore = empStore;
    this.forecastStore = forecastStore;
    this.calEventStore = calEventStore;
  }

  convObjsToSectors = (objs: SectorObj[]): Sector[] => {
    const st = this.secStore;
    const plantMap = genMap(this.plantStore.getLst(), (x) => x.name);
    let f = (obj: SectorObj): Sector => {
      if (!(obj.plant && obj.plant in plantMap)) {
        throw new Error(
          `Line ${obj.line}: Plant "${obj.plant}" of sector "${obj.name}" not defined`
        );
      }
      return st.getNew({
        plant: plantMap[obj.plant][0].id,
        name: obj.name,
        subsectors: [],
      });
    };
    return objs.map(f);
  };

  convSectorsToObjs = (items: Sector[]): SectorObj[] => {
    let f = (item: Sector, idx: number): SectorObj => {
      return {
        _type: ItemType.Sector,
        line: idx,
        name: item.name,
        plant: this.plantStore.get(item.plant).name,
      };
    };
    return items.map(f);
  };

  convObjsToSubsectors = (objs: SubsectorObj[]): Subsector[] => {
    const st = this.subsecStore;
    const plantMap = this.plantStore.getLst();
    const secMap = genMap(this.secStore.getLst(), (x) =>
      k(x.name, plantMap[x.plant].name)
    );
    let f = (obj: SubsectorObj): Subsector => {
      let kk = k(obj.sector.name, obj.sector.plant);
      if (!(kk in secMap)) {
        throw new Error(
          `Line ${obj.line}: Sector "${obj.sector.name}" of subsector "${obj.name}" not defined`
        );
      }
      return st.getNew({
        sector: secMap[kk][0].id,
        name: obj.name,
        unit: obj.unit,
        cycleTime: obj.cycleTime,
        efficiency: obj.efficiency,
      });
    };
    return objs.map(f);
  };

  convSubsectorsToObjs = (items: Subsector[]): SubsectorObj[] => {
    let f = (item: Subsector, idx: number): SubsectorObj => {
      return {
        _type: ItemType.Subsector,
        line: idx,
        name: item.name,
        sector: {
          _type: ItemType.Sector,
          line: idx,
          name: this.secStore.get(item.sector).name,
        },
      };
    };
    return items.map(f);
  };

  convObjsToSkills = (objs: SkillObj[]): Skill[] => {
    const st = this.skillStore;
    const plantMap = this.plantStore.getLst();
    const secMap = this.secStore.getLst();
    const subsecMap = genMap(this.subsecStore.getLst(), (x) =>
      k(x.name, secMap[x.sector].name, plantMap[secMap[x.sector].plant].name)
    );
    let f = (obj: SkillObj): Skill => {
      let kk = k(
        obj.subsector.name,
        obj.subsector.sector.name,
        obj.subsector.sector.plant
      );
      if (!(kk in subsecMap)) {
        throw new Error(
          `Line ${obj.line}: Subsector "${obj.subsector.name}" 
          (Sector: "${obj.subsector.sector.name}", Plant: "${obj.subsector.sector.plant}") 
          of skill "${obj.name}" not defined`
        );
      }
      return st.getNew({
        subsector: subsecMap[kk][0].id,
        name: obj.name,
        priority: obj.priority,
        percentageOfSubsector: obj.percentageOfSubsector,
      });
    };
    return objs.map(f);
  };

  convSkillsToObjs = (items: Skill[]): SkillObj[] => {
    let f = (item: Skill, idx: number): SkillObj => {
      let ss = this.subsecStore.get(item.subsector);
      let s = this.secStore.get(ss.sector);
      let p = this.plantStore.get(s.plant);
      return {
        _type: ItemType.Skill,
        line: idx,
        name: item.name,
        subsector: {
          _type: ItemType.Subsector,
          line: idx,
          name: ss.name,
          sector: {
            _type: ItemType.Sector,
            line: idx,
            name: s.name,
            plant: p.name,
          },
        },
        priority: item.priority,
        percentageOfSubsector: item.percentageOfSubsector,
      };
    };
    return items.map(f);
  };

  private pId: number = 0;
  setPid = (id: number) => {
    this.pId = id;
  };
  convObjsToEmployees = (objs: EmployeeObj[]): Employee[] => {
    const st = this.empStore;
    const secMap = this.secStore.getLst((x) => x.plant === this.pId);
    const subsecMap = this.subsecStore.getLst((x) => x.sector in secMap);
    const skillMap = genMap(
      this.skillStore.getLst((x) => x.subsector in subsecMap),
      (x) =>
        k(
          x.name,
          subsecMap[x.subsector].name,
          secMap[subsecMap[x.subsector].sector].name
        )
    );
    let f = (obj: EmployeeObj): Employee => {
      return st.getNew({
        subsector: obj.subsector,
        firstName: obj.firstName,
        lastName: obj.lastName,
        sesaId: obj.sesaId,
        hireDate: obj.joinDate?.toISOString().slice(0, 10),
        department: obj.department,
        skills: obj.skills.map((sk) => {
          let kk = k(
            sk.skill.name,
            sk.skill.subsector.name,
            sk.skill.subsector.sector.name
          );
          if (!(kk in skillMap)) {
            throw new Error(
              `Col ${sk.skill.line}: Skill "${sk.skill.name}"
              (Subsector: "${sk.skill.subsector.name}", 
              Sector: "${sk.skill.subsector.sector.name}", 
              Plant: "${sk.skill.subsector.sector.plant}")
              not defined`
            );
          }
          return {
            skill: skillMap[kk][0].id,
            level: sk.level,
            desc: "",
          };
        }),
      });
    };
    return objs.map(f);
  };

  convEmployeesToObjs = (items: Employee[]): EmployeeObj[] => {
    let f = (item: Employee, idx: number): EmployeeObj => {
      return {
        _type: ItemType.Employee,
        line: idx,
        firstName: item.firstName,
        lastName: item.lastName,
        sesaId: item.sesaId,
        joinDate: new Date(item.hireDate),
        department: item.department,
        subsector: item.subsector,
        skills: item.skills.map((x) => {
          let sk = this.skillStore.get(x.skill);
          let suk = this.subsecStore.get(sk.subsector);
          let sek = this.secStore.get(suk.sector);
          return {
            skill: {
              _type: ItemType.Skill,
              line: idx,
              name: sk.name,
              subsector: {
                _type: ItemType.Subsector,
                line: idx,
                name: suk.name,
                sector: {
                  _type: ItemType.Sector,
                  line: idx,
                  name: sek.name,
                  plant: this.plantStore.get(sek.plant).name,
                },
              },
            },
            level: x.level,
          };
        }),
      };
    };
    return items.map(f);
  };

  convObjsToForecasts = (objs: ForecastObj[]): Forecast[] => {
    const st = this.forecastStore;
    let f = (obj: ForecastObj): Forecast => {
      return st.getNew({
        ...obj,
        on: new Date(obj.on).toISOString().slice(0, 10),
      });
    };
    return objs.map(f);
  };

  convForecastsToObjs = (items: Forecast[]): ForecastObj[] => {
    let f = (x: Forecast, idx: number) => ({
      _type: x._type,
      line: idx,
      on: new Date(x.on).getTime(),
      forecasts: x.forecasts,
    });
    return items.map(f);
  };

  convObjsToCalEvents = (objs: CalEventObj[]): CalEvent[] => {
    const st = this.calEventStore;
    let f = (obj: CalEventObj): CalEvent => {
      return st.getNew({
        ...obj,
        start: new Date(obj.start).toISOString().slice(0, 10),
        end: new Date(obj.end).toISOString().slice(0, 10),
      });
    };
    return objs.map(f);
  };

  convCalEventsToObjs = (items: CalEvent[]): CalEventObj[] => {
    let f = (x: CalEvent, idx: number) => ({
      _type: x._type,
      line: idx,
      name: x.title,
      start: new Date(x.start).getTime(),
      end: new Date(x.end).getTime(),
      eventType: x.eventType,
    });
    return items.map(f);
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
export { ExcelObjConverter };
export default ExcelProcessor3;
