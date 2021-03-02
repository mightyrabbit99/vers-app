import Excel from "exceljs";

interface SectorObj {
  name: string;
  plant: string;
}

interface SubsectorObj {
  name: string;
  sector: string;
  unit: string;
  cycleTime: number;
  efficiency: number;
}

interface SkillObj {
  name: string;
  subsector: string;
  priority: number;
  percentageOfSector: number;
}

interface SkillMatrixObj {
  skillName: string;
  level: number;
}

interface EmployeeObj {
  sesaId: string;
  firstName: string;
  lastName: string;
  homeLocation: string;
  skills: SkillMatrixObj[];
}

const readEmployeeSheet = (ws: Excel.Worksheet): EmployeeObj[] => {
  let sets: { [homeLocation: string]: Set<string> } = {};
  let ans: EmployeeObj[] = [];
  let sesaId, firstName, lastName, department, homeLocation;
  function checkRow(row: Excel.Row) {
    if (
      [1, 2, 3, 4, 5].some((x) => `${row.getCell(x).value}`.trim().length === 0)
    )
      return false;
    return true;
  }
  ws.eachRow((row, rowIndex) => {
    if (rowIndex === 1 || !checkRow(row)) return;
    [sesaId, firstName, lastName, department, homeLocation] = [
      1,
      2,
      3,
      4,
      5,
    ].map((x) => `${row.getCell(x).value}`.trim());
    if (sesaId === "") return;

    if (!sets[homeLocation]) {
      sets[homeLocation] = new Set();
    }

    let s = sets[homeLocation];
    if (s.has(sesaId)) return;
    s.add(sesaId);
    ans.push({
      sesaId,
      firstName,
      lastName,
      homeLocation,
      skills: [],
    });
  });
  return ans;
};

const readSkillSheet = (ws: Excel.Worksheet): SkillObj[] => {
  let sets: { [subsector: string]: Set<string> } = {};
  let ans: SkillObj[] = [];
  let name, subsector, priority, percentageOfSector;
  ws.eachRow((row, rowIndex) => {
    try {
      if (rowIndex === 1) return;
      [name, subsector, priority, percentageOfSector] = [1, 2, 3, 4].map(x => `${row.getCell(x).value}`.trim());

      if (sets[subsector] && sets[subsector].has(name)) return;
      !sets[subsector] && (sets[subsector] = new Set());
      sets[subsector].add(name);

      ans.push({
        name,
        subsector,
        priority: parseInt(priority, 10),
        percentageOfSector: parseInt(percentageOfSector, 10),
      });
    } catch (e) {
      throw new Error(`Error on skill sheet: Row ${rowIndex}`);
    }
  });
  return ans;
};

const readSubsectorSheet = (ws: Excel.Worksheet): SubsectorObj[] => {
  let sets: { [sector: string]: Set<string> } = {};
  let ans: SubsectorObj[] = [];
  let name, sector, unit, cycleTime, efficiency;
  ws.eachRow((row, rowIndex) => {
    try {
      if (rowIndex === 1) return;
      [name, sector, unit, cycleTime, efficiency] = [1, 2, 3, 4, 5].map((x) =>
        `${row.getCell(x).value}`.trim()
      );

      if (sets[sector] && sets[sector].has(name)) return;
      !sets[sector] && (sets[sector] = new Set());
      sets[sector].add(name);

      ans.push({
        name,
        sector,
        unit,
        cycleTime: parseInt(cycleTime, 10),
        efficiency: parseInt(efficiency, 10),
      });
    } catch (e) {
      throw new Error(`Error on subsector sheet: Row ${rowIndex}`);
    }
  });
  return ans;
};

const readSectorSheet = (ws: Excel.Worksheet): SectorObj[] => {
  let sets: { [plant: string]: Set<string> } = {};
  let ans: SectorObj[] = [];
  let name, plant;
  ws.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return;
    [name, plant] = [1, 2].map((x) => `${row.getCell(x).value}`.trim());

    if (sets[plant] && sets[plant].has(name)) return;
    !sets[plant] && (sets[plant] = new Set());
    sets[plant].add(name);

    ans.push({
      name,
      plant,
    });
  });
  return ans;
};

const employeeSheetWriter = (emps: EmployeeObj[]) => (ws: Excel.Worksheet) => {
  let skillSet = emps.reduce((prev, curr) => {
    curr.skills.forEach(x => prev.add(x.skillName));
    return prev;
  }, new Set());
  ws.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Subsector", key: "subsector" },
    { header: "Priority", key: "priority" },
    { header: "% of Sector", key: "percentageOfSector" },
    ...[...skillSet].map(x => ({ header: x, key: x})),
  ] as Excel.Column[];

  ws.addRows(emps);
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

const subsectorSheetWriter = (subsectors: SubsectorObj[]) => (ws: Excel.Worksheet) => {
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
  static readSectorFile = async (file: File): Promise<SectorObj[]> => {
    return readFile(file, readSectorSheet);
  };
  static readSubsectorFile = async (file: File): Promise<SubsectorObj[]> => {
    return readFile(file, readSubsectorSheet);
  };
  static readSkillFile = async (file: File): Promise<SkillObj[]> => {
    return readFile(file, readSkillSheet);
  };
  static readEmployeeFile = async (file: File): Promise<EmployeeObj[]> => {
    return readFile(file, readEmployeeSheet);
  };

  static genSectorFile = async (sectors: SectorObj[]) => {
    return genFile(sectorSheetWriter(sectors));
  };

  static genSubsectorFile = async (subsectors: SubsectorObj[]) => {
    return genFile(subsectorSheetWriter(subsectors));
  };

  static genSkillFile = async (skills: SkillObj[]) => {
    return genFile(skillSheetWriter(skills));
  };

  static genEmployeeFile = async (emps: EmployeeObj[]) => {
    return genFile(employeeSheetWriter(emps));
  };
}

export default ExcelProcessor2;