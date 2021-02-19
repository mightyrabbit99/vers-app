import Excel from "exceljs";
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
}

export default ExcelProcessor;
