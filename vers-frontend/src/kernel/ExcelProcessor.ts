import Excel from "exceljs";
import { Employee } from "./Employee";
import k from "./Kernel";
import { Plant } from "./Plant";
import { ItemType } from "./Store";

class ExcelProcessor {
  readPlantFile = async (file: File) => {
    return new Promise((resolve, reject) => {
      const wb = new Excel.Workbook();
      const reader = new FileReader();

      reader.onload = async () => {
        const plants: Plant[] = [];
        const buffer = reader.result as ArrayBuffer;
        try {
          let x = await wb.xlsx.load(buffer);
          const mainSheet = x.getWorksheet(1);
          mainSheet.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return;
            let name = row.getCell(1).value;
            plants.push({
              _type: ItemType.Plant,
              id: -1,
              name: `${name}`,
              sectors: [],
            });
          });
        } catch (e) {
          reject(e);
        }
        resolve(plants);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  readEmployeeFile = async (file: File) => {
    let deptDic: any = {};
    Object.values(k.deptStore.getLst()).forEach(x => { deptDic[x.name] = x.id; });
    let homeLocDic: any = {};
    Object.values(k.subsecStore.getLst()).forEach(x => { homeLocDic[x.name] = x.id; });
    const verifyRow = (row: Excel.Row) => {
      if ([...Array(5).keys()].some(x => !row.getCell(x + 1).value)) throw Error();
      let sesaId = row.getCell(1).value?.toString();
      let dept = row.getCell(4).value?.toString();
      let home_location = row.getCell(5).value?.toString();
      if (sesaId?.substring(0, 4).toUpperCase() !== 'SESA') throw Error();
      if (!(dept && deptDic[dept])) throw Error();
      if (!(home_location && homeLocDic[home_location])) throw Error();
    }
    const rowToEmp = (row: Excel.Row) => {
      return {
        id: -1,
        _type: ItemType.Employee,
        sesaId: `${row.getCell(1).value}`,
        firstName: `${row.getCell(2).value}`,
        lastName: `${row.getCell(3).value}`,
        subsector: homeLocDic[row.getCell(5).value?.toString() ?? 0],
        department: deptDic[row.getCell(4).value?.toString() ?? 0],
        skills: [],
        available: true,
        reportTo: -1,
        birthDate: "",
        gender: "",
        hireDate: "",
        user: {
          id: -1,
          username: "",
          is_superuser: false,
          is_active: false,
          vers_user: {
            plant_group: 1,
            sector_group: 1,
            subsector_group: 1,
            department_group: 1,
            employee_group: 1,
            job_group: 1,
            skill_group: 1,
          },
        },
      };
    };
    return new Promise((resolve, reject) => {
      const wb = new Excel.Workbook();
      const reader = new FileReader();

      reader.onload = async () => {
        const emps: Employee[] = [];
        const buffer = reader.result as ArrayBuffer;
        try {
          let x = await wb.xlsx.load(buffer);
          const mainSheet = x.getWorksheet(1);
          mainSheet.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return;
            verifyRow(row);
            emps.push(rowToEmp(row));
          });
        } catch (e) {
          reject(e);
        }
        resolve(emps);
      };
      reader.readAsArrayBuffer(file);
    });
  };
}

export default ExcelProcessor;
