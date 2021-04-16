import fs from "fs";
import { ItemType } from "src/kernel";
import ExcelProcessor3 from 'src/kernel/ExcelProcessor3';

const sampleEmployeeXlsx = `${process.env.REACT_APP_EXCEL_TEMPLATE_PATH}${process.env.REACT_APP_EXCEL_EMPLOYEE_PATH}`;

async function readXlsx(filename: string): Promise<Buffer> {
  return new Promise((res, rej) =>
    fs.readFile(filename, (err, data) => {
      if (err) rej(err);
      res(data);
    })
  );
}

test('test test', () => {
  console.log("Haha");
  expect(2 + 2).toEqual(4);
});

test("read employee", async () => {
  const data = await readXlsx(sampleEmployeeXlsx);
  let objs = await ExcelProcessor3.readBuffer(ItemType.Employee, data);
  console.log(objs.length);
});
