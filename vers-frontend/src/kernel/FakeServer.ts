import {
  SkillData,
  DepartmentData,
  EmployeeData,
  JobData,
  PlantData,
  SectorData,
  SubsectorData,
} from "./data";

type GetResponse = { data: any; status: number };
type PostResponse = { data: any; status: number };
type PutResponse = { data: any; status: number };
type DeleteResponse = { data: any; status: number };

const dummyPlantDatas: PlantData[] = [
  {
    id: 1,
    name: "Hub Asia DC",
    sectors: [],
  },
  {
    id: 2,
    name: "Hub Asia Adaptation",
    sectors: [],
  },
];

const dummySectorDatas: SectorData[] = [
  {
    id: 1,
    plant: 1,
    name: "Inbound",
    subsectors: [],
  },
  {
    id: 2,
    plant: 1,
    name: "Outbound",
    subsectors: [],
  },
  {
    id: 3,
    plant: 1,
    name: "ITB",
    subsectors: [],
  },
  {
    id: 4,
    plant: 1,
    name: "VAS",
    subsectors: [],
  },
  {
    id: 5,
    plant: 1,
    name: "Taskforce",
    subsectors: [],
  },
  {
    id: 6,
    plant: 1,
    name: "CS&Q",
    subsectors: [],
  },
];

const dummySubsectorDatas: SubsectorData[] = [
  {
    id: 1,
    sector: 1,
    name: "Receiving",
    cycle_time: 2,
    efficiency: 60,
    skills: [],
    employees: [],
    jobs: [],
  },
  {
    id: 2,
    sector: 1,
    name: "Sorting",
    cycle_time: 3,
    efficiency: 55,
    skills: [],
    employees: [],
    jobs: [],
  },
  {
    id: 3,
    sector: 1,
    name: "MIGO",
    cycle_time: 2,
    efficiency: 82,
    skills: [],
    employees: [],
    jobs: [],
  },
  {
    id: 4,
    sector: 2,
    name: "Picking",
    cycle_time: 4,
    efficiency: 47,
    skills: [],
    employees: [],
    jobs: [],
  },
  {
    id: 5,
    sector: 2,
    name: "Weight Control",
    cycle_time: 3,
    efficiency: 64,
    skills: [],
    employees: [],
    jobs: [],
  },
  {
    id: 6,
    sector: 2,
    name: "Packing",
    cycle_time: 2,
    efficiency: 55,
    skills: [],
    employees: [],
    jobs: [],
  },
];

const dummySkillDatas: SkillData[] = [
  {
    id: 1,
    name: "Adapt Picking",
    priority: 1,
    percentage_of_sector: 10,
    subsector: 4,
    employees: [],
    jobs: [],
  },
  {
    id: 2,
    name: "Proface Picking",
    priority: 2,
    percentage_of_sector: 5,
    subsector: 4,
    employees: [],
    jobs: [],
  },
  {
    id: 3,
    name: "Standard Picking",
    priority: 3,
    percentage_of_sector: 80,
    subsector: 4,
    employees: [],
    jobs: [],
  },
];

const dummyDeptDatas: DepartmentData[] = [
  {
    id: 1,
    name: "Logistic",
    employees: [],
  },
];

const dummyEmpDatas: EmployeeData[] = [
  {
    available: true,
    birth_date: "2021-01-13",
    first_name: "John",
    gender: "M",
    subsector: 1,
    hire_date: "2021-01-14",
    last_name: "Doe",
    id: 1,
    profile_pic: "http://localhost:8000/files/profile_pic/Screenshot_1.png",
    sesa_id: "1233",
    department: 1,
    skills: [],
    user: {
      id: -1,
      username: "",
      is_superuser: false,
      is_active: false,
      vers_user: {
        id: -1,
        user: "",
        plant_group: 1,
        sector_group: 1,
        subsector_group: 1,
        employee_group: 1,
        job_group: 1,
        skill_group: 1,
      }
    }
  },
];

const dummyJobDatas: JobData[] = [
  {
    id: 1,
    title: "Sleeping",
    ppl_amt_required: 2,
    salary_amount: 1000,
    from_date: "2021-01-01",
    to_date: "2021-01-09",
    skills_required: [],
    emp_assigned: [1],
    subsector: 1,
  },
];

class FakeServer {
  plantDataList: PlantData[] = dummyPlantDatas;
  sectorDataList: SectorData[] = dummySectorDatas;
  subsectorDataList: SubsectorData[] = dummySubsectorDatas;
  deptDataList: DepartmentData[] = dummyDeptDatas;
  empDataList: EmployeeData[] = dummyEmpDatas;
  jobDataList: JobData[] = dummyJobDatas;
  skillDataList: SkillData[] = dummySkillDatas;

  public get = async (url: string, config?: any): Promise<GetResponse> => {
    console.log("GET");
    switch (true) {
      case /http:\/\/127.0.0.1:8000\/api\/plant\//.test(url):
        return { status: 200, data: this.plantDataList };
      case /http:\/\/127.0.0.1:8000\/api\/sec\//.test(url):
        return { status: 200, data: this.sectorDataList };
      case /http:\/\/127.0.0.1:8000\/api\/subsec\//.test(url):
        return { status: 200, data: this.subsectorDataList };
      case /http:\/\/127.0.0.1:8000\/api\/dept\//.test(url):
        return { status: 200, data: this.deptDataList };
      case /http:\/\/127.0.0.1:8000\/api\/emp\//.test(url):
        return { status: 200, data: this.empDataList };
      case /http:\/\/127.0.0.1:8000\/api\/job\//.test(url):
        return { status: 200, data: this.jobDataList };
      case /http:\/\/127.0.0.1:8000\/api\/skill\//.test(url):
        return { status: 200, data: this.skillDataList };
      default:
        return { status: 200, data: [] };
    }
  };

  public post = async (
    url: string,
    data: any,
    config?: any
  ): Promise<PostResponse> => {
    console.log("POST");
    const addToLst = (lst: any[], data: any) => {
      lst.push(data);
      data.id = Math.max(...lst.map((x) => x.id ?? 0)) + 1;
    };
    switch (true) {
      case /http:\/\/127.0.0.1:8000\/api\/plant\//.test(url):
        addToLst(this.plantDataList, data);
        return { status: 201, data };
      case /http:\/\/127.0.0.1:8000\/api\/sec\//.test(url):
        addToLst(this.sectorDataList, data);
        return { status: 201, data };
      case /http:\/\/127.0.0.1:8000\/api\/subsec\//.test(url):
        addToLst(this.subsectorDataList, data);
        return { status: 201, data };
      case /http:\/\/127.0.0.1:8000\/api\/dept\//.test(url):
        addToLst(this.deptDataList, data);
        return { status: 201, data };
      case /http:\/\/127.0.0.1:8000\/api\/emp\//.test(url):
        addToLst(this.empDataList, data);
        return { status: 201, data };
      case /http:\/\/127.0.0.1:8000\/api\/job\//.test(url):
        addToLst(this.jobDataList, data);
        return { status: 201, data };
      case /http:\/\/127.0.0.1:8000\/api\/skill\//.test(url):
        addToLst(this.skillDataList, data);
        return { status: 201, data };
      case /http:\/\/127.0.0.1:8000\/api-token-auth\//.test(url):
        return { status: 200, data: { token: "asdf " } };
      default:
        return { status: 201, data };
    }
  };

  public put = async (
    url: string,
    data: any,
    config?: any
  ): Promise<PutResponse> => {
    console.log("PUT");
    switch (true) {
      case /http:\/\/127.0.0.1:8000\/api\/plant\//.test(url):
        Object.assign(this.plantDataList[data.id - 1], data);
        return { status: 200, data };
      case /http:\/\/127.0.0.1:8000\/api\/sec\//.test(url):
        Object.assign(this.sectorDataList[data.id - 1], data);
        return { status: 200, data };
      case /http:\/\/127.0.0.1:8000\/api\/subsec\//.test(url):
        Object.assign(this.subsectorDataList[data.id - 1], data);
        return { status: 200, data };
      case /http:\/\/127.0.0.1:8000\/api\/emp\//.test(url):
        Object.assign(this.empDataList[data.id - 1], data);
        return { status: 200, data };
      case /http:\/\/127.0.0.1:8000\/api\/job\//.test(url):
        Object.assign(this.jobDataList[data.id - 1], data);
        return { status: 200, data };
      case /http:\/\/127.0.0.1:8000\/api\/dept\//.test(url):
        Object.assign(this.deptDataList[data.id - 1], data);
        return { status: 200, data };
      case /http:\/\/127.0.0.1:8000\/api\/skill\//.test(url):
        Object.assign(this.skillDataList[data.id - 1], data);
        return { status: 200, data };
      default:
        return { status: 200, data };
    }
  };

  public delete = async (
    url: string,
    config?: any
  ): Promise<DeleteResponse> => {
    console.log("DELETE");
    let id = parseInt(url.split("/").pop() ?? "0", 10);
    switch (true) {
      case /http:\/\/127.0.0.1:8000\/api\/plant\/.*/.test(url):
        this.plantDataList = this.plantDataList.filter((x) => x.id !== id);
        return { status: 200, data: {} };
      case /http:\/\/127.0.0.1:8000\/api\/sec\/.*/.test(url):
        this.sectorDataList = this.sectorDataList.filter((x) => x.id !== id);
        return { status: 200, data: {} };
      case /http:\/\/127.0.0.1:8000\/api\/subsec\/.*/.test(url):
        this.subsectorDataList = this.subsectorDataList.filter(
          (x) => x.id !== id
        );
        return { status: 200, data: {} };
      case /http:\/\/127.0.0.1:8000\/api\/emp\/.*/.test(url):
        this.empDataList = this.empDataList.filter((x) => x.id !== id);
        return { status: 200, data: {} };
      case /http:\/\/127.0.0.1:8000\/api\/job\/.*/.test(url):
        this.jobDataList = this.jobDataList.filter((x) => x.id !== id);
        return { status: 200, data: {} };
      case /http:\/\/127.0.0.1:8000\/api\/dept\/.*/.test(url):
        this.deptDataList = this.deptDataList.filter((x) => x.id !== id);
        return { status: 200, data: {} };
      case /http:\/\/127.0.0.1:8000\/api\/skill\/.*/.test(url):
        this.skillDataList = this.skillDataList.filter((x) => x.id !== id);
        return { status: 200, data: {} };
      default:
        return { status: 200, data: {} };
    }
  };
}

export default FakeServer;
