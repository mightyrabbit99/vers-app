let ExcelJs = require("exceljs");
let fs = require("fs");

async function readXlsx(filename) {
  return new Promise((res, rej) =>
    fs.readFile(filename, (err, data) => {
      if (err) rej(err);
      res(data);
    })
  );
}

async function getExcelWorkbook(raw_file) {
  return new Promise(async (res, rej) => {
    try {
      const wb = new ExcelJs.Workbook();
      const r = await wb.xlsx.load(raw_file);
      res(r);
    } catch(e) {
      rej(e);
    }
  });
}

async function getExcelSheet(filename, sheet_name) {
  let b = await getExcelWorkbook(await readXlsx(filename));
  return b.getWorksheet(sheet_name);
}

exports.getExcelSheet = getExcelSheet;
