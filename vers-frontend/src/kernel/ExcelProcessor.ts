import Excel from "exceljs";

interface EmployeeObjData {
  sesaId: string;
  firstName: string;
  lastName: string;
}

interface EmployeeObj {
  data: EmployeeObjData;
}

interface SkillObjData {
  name: string;
  priority: number;
  percentageOfSector: number;
}

interface SkillObj {
  data: SkillObjData;
}

interface DepartmentObjData {
  name: string;
}

interface DepartmentObj {
  data: DepartmentObjData;
  employees: EmployeeObj[];
}

interface SubsectorObjData {
  name: string;
  unit: string;
  cycleTime: number;
  efficiency: number;
}

interface SubsectorObj {
  data: SubsectorObjData;
  skills: SkillObj[];
  employees: EmployeeObj[];
}

interface SectorObjData {
  name: string;
}

interface SectorObj {
  data: SectorObjData;
  subsectors: SubsectorObj[];
}

type Mapp<T> = { [name: string]: T[] };

const readSubsectorWorksheet = (ws: Excel.Worksheet) => {
  let sets: { [sector: string]: Set<string> } = {};
  let ans: { [sector: string]: SubsectorObjData[] } = {};
  let secName, subsecName, unit, cycleTime, efficiency;
  ws.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return;
    [secName, subsecName, unit, cycleTime, efficiency] = [1, 2, 3, 4, 5].map(
      (x) => `${row.getCell(x).value}`
    );
    if (!sets[secName]) {
      sets[secName] = new Set();
      ans[secName] = [];
    }

    let s = sets[secName];
    if (s.has(subsecName)) return;
    s.add(subsecName);
    ans[secName].push({
      name: subsecName,
      cycleTime: parseInt(cycleTime, 10),
      efficiency: parseInt(efficiency, 10),
      unit,
    });
  });
  return ans;
};

const readSkillWorksheet = (ws: Excel.Worksheet) => {
  let sets: { [subsector: string]: Set<string> } = {};
  let ans: { [subsector: string]: SkillObjData[] } = {};
  let subsecName, skillName, priority, percentage;
  ws.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return;
    [skillName, subsecName, priority, percentage] = [1, 2, 3, 4].map(
      (x) => `${row.getCell(x).value}`
    );
    if (!sets[subsecName]) {
      sets[subsecName] = new Set();
      ans[subsecName] = [];
    }

    let s = sets[subsecName];
    if (s.has(skillName)) return;
    s.add(skillName);
    ans[subsecName].push({
      name: skillName,
      priority: parseInt(priority, 10),
      percentageOfSector: parseInt(percentage, 10),
    });
  });
  return ans;
};

const readEmployeeWorksheetDept = (ws: Excel.Worksheet) => {
  let sets: { [dept: string]: Set<string> } = {};
  let ans: { [dept: string]: EmployeeObjData[] } = {};
  let sesaId, firstName, lastName, department, homeLocation;
  ws.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return;
    [sesaId, firstName, lastName, department, homeLocation] = [
      1,
      2,
      3,
      4,
      5,
    ].map((x) => `${row.getCell(x).value}`);

    if (!sets[department]) {
      sets[department] = new Set();
      ans[department] = [];
    }

    let s = sets[department];
    if (s.has(sesaId)) return;
    s.add(sesaId);
    ans[department].push({
      sesaId,
      firstName,
      lastName,
    });
  });
  return ans;
};

const readEmployeeWorksheetSubsec = (ws: Excel.Worksheet) => {
  let sets: { [dept: string]: Set<string> } = {};
  let ans: { [dept: string]: EmployeeObjData[] } = {};
  let sesaId, firstName, lastName, department, homeLocation;
  ws.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return;
    [sesaId, firstName, lastName, department, homeLocation] = [
      1,
      2,
      3,
      4,
      5,
    ].map((x) => `${row.getCell(x).value}`);

    if (!sets[homeLocation]) {
      sets[homeLocation] = new Set();
      ans[homeLocation] = [];
    }

    let s = sets[homeLocation];
    if (s.has(sesaId)) return;
    s.add(sesaId);
    ans[homeLocation].push({
      sesaId,
      firstName,
      lastName,
    });
  });
  return ans;
};

const getSkills = (subsecSkillMap: Mapp<SkillObjData>): Mapp<SkillObj> => {
  return {};
};

const getEmps = (deptEmpMap: Mapp<EmployeeObjData>): Mapp<EmployeeObj> => {
  return {};
};

const getDepts = (
  deptEmpMap: Mapp<EmployeeObjData>,
  emps: Mapp<EmployeeObj>
): Mapp<DepartmentObj> => {
  return {};
};

const getSubsecs = (
  subsecEmpMap: Mapp<EmployeeObjData>,
  emps: Mapp<EmployeeObj>,
  skills: Mapp<SkillObj>
): Mapp<SubsectorObj> => {
  return {};
};

const getSectors = (
  secSubsecMap: Mapp<SubsectorObjData>,
  subsecs: Mapp<SubsectorObj>
): Mapp<SectorObj> => {
  return {};
};

const getRoots = (
  secSubsecMap: Mapp<SubsectorObjData>,
  subsecSkillMap: Mapp<SkillObjData>,
  deptEmpMap: Mapp<EmployeeObjData>,
  subsecEmpMap: Mapp<EmployeeObjData>
) => {
  let skills = getSkills(subsecSkillMap);
  let emps = getEmps(deptEmpMap);
  let depts = getDepts(deptEmpMap, emps);
  let subsecs = getSubsecs(subsecEmpMap, emps, skills);
  let sectors: Mapp<SectorObj> = getSectors(secSubsecMap, subsecs);

  return {
    sectors: Object.values(sectors).flatMap((x) => x),
    departments: Object.values(depts).flatMap((x) => x),
  };
};

interface ReadResult {
  sectors: SectorObj[];
  departments: DepartmentObj[];
}

class ExcelProcessor {
  static readFile = async (file: File): Promise<ReadResult> => {
    return new Promise((resolve, reject) => {
      const wb = new Excel.Workbook();
      const reader = new FileReader();

      reader.onload = async () => {
        const buffer = reader.result as ArrayBuffer;
        try {
          let x = await wb.xlsx.load(buffer);
          let subsectorSheet = x.getWorksheet("Subsectors"),
            skillSheet = x.getWorksheet("Skills"),
            empSheet = x.getWorksheet("Employees");

          let secSubsecMap = readSubsectorWorksheet(subsectorSheet),
            subsecSkillMap = readSkillWorksheet(skillSheet),
            deptEmpMap = readEmployeeWorksheetDept(empSheet),
            subsecEmpMap = readEmployeeWorksheetSubsec(empSheet);

          resolve(
            getRoots(secSubsecMap, subsecSkillMap, deptEmpMap, subsecEmpMap)
          );
        } catch (e) {
          reject(e);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };
}

export default ExcelProcessor;
