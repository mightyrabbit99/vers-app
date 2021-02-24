import Excel from "exceljs";

interface EmployeeObjData {
  department?: number;
  subsector?: number;
  sesaId: string;
  firstName: string;
  lastName: string;
}

interface EmployeeObj {
  id?: number;
  data: EmployeeObjData;
}

interface SkillObjData {
  subsector?: number;
  name: string;
  priority: number;
  percentageOfSector: number;
}

interface SkillObj {
  id?: number;
  data: SkillObjData;
}

interface DepartmentObjData {
  name: string;
}

interface DepartmentObj {
  id?: number;
  data: DepartmentObjData;
  employees: EmployeeObj[];
}

interface SubsectorObjData {
  sector?: number;
  name: string;
  unit: string;
  cycleTime: number;
  efficiency: number;
}

interface SubsectorObj {
  id?: number;
  data: SubsectorObjData;
  skills: SkillObj[];
  employees: EmployeeObj[];
}

interface SectorObjData {
  name: string;
}

interface SectorObj {
  id?: number;
  data: SectorObjData;
  subsectors: SubsectorObj[];
}

type Mapp<T> = { [name: string]: T[] };

const readSubsectorWorksheet = (ws: Excel.Worksheet) => {
  let sets: { [sector: string]: Set<string> } = {};
  let ans: { [sector: string]: SubsectorObjData[] } = {};
  let subsecName, secName, unit, cycleTime, efficiency;
  function checkRow(row: Excel.Row) {
    if (
      [1, 2, 3, 4, 5].some((x) => `${row.getCell(x).value}`.trim().length === 0)
    )
      return false;
    return true;
  }
  ws.eachRow((row, rowIndex) => {
    if (rowIndex === 1 || !checkRow(row)) return;
    [subsecName, secName, unit, cycleTime, efficiency] = [
      1,
      2,
      3,
      4,
      5,
    ].map((x) => `${row.getCell(x).value}`.trim());
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
  function checkRow(row: Excel.Row) {
    if ([1, 2, 3, 4].some((x) => `${row.getCell(x).value}`.trim().length === 0))
      return false;
    return true;
  }
  ws.eachRow((row, rowIndex) => {
    if (rowIndex === 1 || !checkRow(row)) return;
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

const getSkills = (
  subsecSkillMap: Mapp<SkillObjData>
): { [name: string]: SkillObj } => {
  let ans: { [name: string]: SkillObj } = {};
  for (let arr of Object.values(subsecSkillMap)) {
    for (let x of arr) {
      if (ans[x.name]) continue;
      ans[x.name] = {
        data: x,
      };
    }
  }
  return ans;
};

const getEmps = (
  deptEmpMap: Mapp<EmployeeObjData>
): { [sesaId: string]: EmployeeObj } => {
  let ans: { [sesaId: string]: EmployeeObj } = {};
  for (let arr of Object.values(deptEmpMap)) {
    for (let x of arr) {
      if (ans[x.sesaId]) continue;
      ans[x.sesaId] = {
        data: x,
      };
    }
  }
  return ans;
};

const getDepts = (
  deptEmpMap: Mapp<EmployeeObjData>,
  emps: { [sesaId: string]: EmployeeObj }
): { [name: string]: DepartmentObj } => {
  let ans: { [name: string]: DepartmentObj } = {};
  for (let [deptName, empObjDatas] of Object.entries(deptEmpMap)) {
    ans[deptName] = {
      data: {
        name: deptName,
      },
      employees: empObjDatas.map((x) => emps[x.sesaId]),
    };
  }
  return ans;
};

const getSubsecs = (
  secSubsecMap: Mapp<SubsectorObjData>,
  subsecEmpMap: Mapp<EmployeeObjData>,
  subsecSkillMap: Mapp<SkillObjData>,
  emps: { [sesaId: string]: EmployeeObj },
  skills: { [name: string]: SkillObj }
): { [name: string]: SubsectorObj } => {
  let ans: { [name: string]: SubsectorObj } = {};
  for (let [secName, subsecNames] of Object.entries(secSubsecMap)) {
    for (let y of subsecNames) {
      ans[y.name] = {
        data: y,
        skills: [],
        employees: [],
      };
    }
  }
  for (let [subsecName, empObjDatas] of Object.entries(subsecEmpMap)) {
    ans[subsecName].employees = empObjDatas.map((x) => emps[x.sesaId]);
  }
  for (let [subsecName, skillObjDatas] of Object.entries(subsecSkillMap)) {
    ans[subsecName].skills = skillObjDatas.map((x) => skills[x.name]);
  }
  return ans;
};

const getSectors = (
  secSubsecMap: Mapp<SubsectorObjData>,
  subsecs: { [name: string]: SubsectorObj }
): { [name: string]: SectorObj } => {
  let ans: { [name: string]: SectorObj } = {};
  for (let [secName, subsecObjDatas] of Object.entries(secSubsecMap)) {
    ans[secName] = {
      data: {
        name: secName,
      },
      subsectors: subsecObjDatas.map((x) => subsecs[x.name]),
    };
  }
  return ans;
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
  let subsecs = getSubsecs(
    secSubsecMap,
    subsecEmpMap,
    subsecSkillMap,
    emps,
    skills
  );
  let sectors = getSectors(secSubsecMap, subsecs);

  return {
    sectors: Object.values(sectors),
    departments: Object.values(depts),
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

export type { SubsectorObj, SectorObj, DepartmentObj, SkillObj, EmployeeObj };
export default ExcelProcessor;
