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

const readEmployeeSheet = (
  sheet: Excel.Worksheet
): { [plant: string]: EmployeeObj[] } => {
  return {};
};

const readSkillSheet = (
  sheet: Excel.Worksheet
): { [plant: string]: SkillObj[] } => {
  return {};
};

const readSubsectorSheet = (
  sheet: Excel.Worksheet
): { [plant: string]: SubsectorObj[] } => {
  return {};
};

const readSectorSheet = (
  sheet: Excel.Worksheet
): { [plant: string]: SectorObj[] } => {
  return {};
};

const writeEmployeeSheet = (sheet: Excel.Worksheet) => {};

const writeSkillSheet = (sheet: Excel.Worksheet) => {};

const writeSubsectorSheet = (sheet: Excel.Worksheet) => {};

const writeSectorSheet = (sheet: Excel.Worksheet) => {};

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
  static readSectorFile = async (
    file: File
  ): Promise<{ [plant: string]: SectorObj[] }> => {
    return readFile(file, readSectorSheet);
  };
  static readSubsectorFile = async (
    file: File
  ): Promise<{ [sector: string]: SubsectorObj[] }> => {
    return readFile(file, readSubsectorSheet);
  };
  static readSkillFile = async (
    file: File
  ): Promise<{ [subsector: string]: SkillObj[] }> => {
    return readFile(file, readSkillSheet);
  };
  static readEmployeeFile = async (
    file: File
  ): Promise<{ [subsector: string]: EmployeeObj[] }> => {
    return readFile(file, readEmployeeSheet);
  };

  static genSectorFile = async (sectors: SectorObj[]) => {
    return genFile(writeSectorSheet);
  };

  static genSubsectorFile = async (subsectors: SubsectorObj[]) => {
    return genFile(writeSubsectorSheet);
  };

  static genSkillFile = async (skills: SkillObj[]) => {
    return genFile(writeSkillSheet);
  };

  static genEmployeeFile = async (emps: EmployeeObj[]) => {
    return genFile(writeEmployeeSheet);
  };
}

export default ExcelProcessor2;
