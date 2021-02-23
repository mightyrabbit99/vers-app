import { all, put, takeLatest, call } from "redux-saga/effects";
import k, { Result, ExcelProcessor } from "src/kernel";
import {
  DepartmentObj,
  SectorObj,
  SubsectorObj,
  SkillObj,
  EmployeeObj,
} from "src/kernel/ExcelProcessor";

import {
  calculate,
  _reload,
  reload,
  _saveData,
  reloadSuccess,
  reloadError,
} from "src/slices/data";
import {
  createNew,
  modify,
  erase,
  submitError,
  submitSuccess,
  fetchData,
  fetchDataSuccess,
  submitExcel,
} from "src/slices/sync";
import {
  CreateNewAction,
  EraseAction,
  ModifyAction,
  SubmitExcelAction,
} from "src/types";

function* loadState() {
  let plants, sectors, subsectors, skills, departments, employees, jobs;
  let newPlant,
    newSector,
    newSubsector,
    newSkill,
    newDepartment,
    newEmployee,
    newJob;
  plants = k.plantStore.getLst();
  newPlant = k.plantStore.getNew();
  sectors = k.secStore.getLst();
  newSector = k.secStore.getNew();
  subsectors = k.subsecStore.getLst();
  newSubsector = k.subsecStore.getNew();
  skills = k.skillStore.getLst();
  newSkill = k.skillStore.getNew();
  departments = k.deptStore.getLst();
  newDepartment = k.deptStore.getNew();
  employees = k.empStore.getLst();
  newEmployee = k.empStore.getNew();
  jobs = k.jobStore.getLst();
  newJob = k.jobStore.getNew();
  yield put(
    _reload({
      plants,
      newPlant,
      sectors,
      newSector,
      subsectors,
      newSubsector,
      skills,
      newSkill,
      departments,
      newDepartment,
      employees,
      newEmployee,
      jobs,
      newJob,
    })
  );
}

function* fetchDatas() {
  try {
    yield call(k.refresh);
    yield put(reload());
    yield loadState();
    yield put(reloadSuccess());
  } catch (error) {
    yield put(reloadError(error.message));
  }

  yield put(calculate());
  yield put(fetchDataSuccess());
}

function* postItemThenSave({ payload }: CreateNewAction) {
  try {
    console.log(payload);
    const feedback: Result = yield k.saveNew(payload);
    console.log(feedback);
    if (feedback.success) {
      yield put(_saveData(feedback.data));
      yield put(submitSuccess(undefined));
    } else {
      yield put(submitSuccess(feedback.data));
    }
  } catch (error) {
    yield put(submitError(error.message));
  }
  yield put(calculate());
}

function* putItem({ payload }: ModifyAction) {
  if (!(payload instanceof Array)) {
    payload = [payload];
  }
  try {
    for (let p of payload) {
      yield k.save(p);
    }
    yield put(submitSuccess(undefined));
  } catch (error) {
    yield put(submitError(error.message));
  }
}

function* deleteItem({ payload }: EraseAction) {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }
  try {
    for (let p of payload) {
      yield k.del(p);
    }
    yield put(submitSuccess(undefined));
  } catch (error) {
    yield put(submitError(error.message));
  }
}

function genMap<T>(lst: { [id: number]: T}, idMapper: (x: T) => any) {
  return Object.values(lst).reduce((prev, curr) => { 
    prev[idMapper(curr)] = curr;
    return prev;
  }, {} as { [name: string]: T });
}

function* saveExcelDatas(sectors: SectorObj[], departments: DepartmentObj[]) {
  let plantId = 1;
  let sectorLst = k.secStore.getLst(x => x.plant == plantId);
  let subsectorLst = k.subsecStore.getLst(x => x.sector in sectorLst);
  let employeeLst = k.empStore.getLst(x => x.subsector in subsectorLst);

  let sectorNameMap = genMap(sectorLst, x => x.name);
  let subsectorNameMap = genMap(subsectorLst, x => x.name);
  let empSesaMap = genMap(employeeLst, x => x.sesaId);

  function* saveSkill(skill: SkillObj) {
    if (skill.data.name in subsectorNameMap) {
      let origin = subsectorNameMap[skill.data.name];
      Object.assign(origin, skill.data);
      yield k.save(origin);
      skill.id = origin.id;
    } else {
      let res = yield k.saveNew(k.skillStore.getNew(skill.data));
      skill.id = res.data.id;
    }
  }
  function* saveEmployee(emp: EmployeeObj) {
    if (emp.data.sesaId in empSesaMap) {
      let origin = empSesaMap[emp.data.sesaId];
      Object.assign(origin, emp.data);
      yield k.save(origin);
      emp.id = origin.id;
    } else {
      let res = yield k.saveNew(k.empStore.getNew(emp.data));
      emp.id = res.data.id;
    }
  }
  function* performSaveSubsector(subsec: SubsectorObj) {
    if (subsec.data.name in subsectorNameMap) {
      let origin = subsectorNameMap[subsec.data.name];
      Object.assign(origin, subsec.data);
      yield k.save(origin);
      subsec.id = origin.id;
    } else {
      let res = yield k.saveNew(k.subsecStore.getNew(subsec.data));
      subsec.id = res.data.id;
    }
    subsec.skills.forEach(x => x.data.subsector = subsec.id);
    subsec.employees.forEach(x => x.data.subsector = subsec.id);
  }
  function* saveSubsector(subsec: SubsectorObj) {
    yield performSaveSubsector(subsec);
    for (let skill of subsec.skills) {
      yield saveSkill(skill);
    }
    for (let emp of subsec.employees) {
      yield saveEmployee(emp);
    }
  }
  function* performSaveSector(sec: SectorObj) {
    if (sec.data.name in sectorNameMap) {
      let origin = sectorNameMap[sec.data.name];
      Object.assign(origin, sec.data);
      yield k.save(origin);
      sec.id = origin.id;
    } else {
      let res = yield k.saveNew(k.secStore.getNew({ ...sec.data, plant: plantId }));
      sec.id = res.data.id;
    }
    sec.subsectors.forEach(x => x.data.sector = sec.id);
  }
  function* saveSector(sec: SectorObj) {
    yield performSaveSector(sec);
    for (let subsec of sec.subsectors) {
      yield saveSubsector(subsec);
    }
  }
  function* performSaveDept(dept: DepartmentObj) {}
  function* saveDept(dept: DepartmentObj) {
    yield performSaveDept(dept);
    for (let emp of dept.employees) {
      yield saveEmployee(emp);
    }
  }
  for (let sec of sectors) {
    yield saveSector(sec);
  }
  for (let dept of departments) {
    yield saveDept(dept);
  }
}

function* processExcel({ payload: file }: SubmitExcelAction) {
  let sectors = [],
    departments = [];
  try {
    [sectors, departments] = yield ExcelProcessor.readFile(file);
  } catch (error) {
    yield put(submitSuccess(error));
    return;
  }
  try {
    saveExcelDatas(sectors, departments);
  } catch (error) {
    yield put(submitError(error));
  }
  yield put(reload());
  yield loadState();
  yield put(reloadSuccess());
  yield put(submitSuccess(undefined));
}

function* syncSaga() {
  yield all([
    takeLatest(fetchData.type, fetchDatas),
    takeLatest(createNew.type, postItemThenSave),
    takeLatest(modify.type, putItem),
    takeLatest(erase.type, deleteItem),
    takeLatest(submitExcel.type, processExcel),
  ]);
}

export default syncSaga;
