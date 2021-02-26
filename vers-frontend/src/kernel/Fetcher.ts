import {
  DepartmentData,
  EmployeeData,
  EmpSkillData,
  JobData,
  JobSkillData,
  PlantData,
  SectorData,
  SkillData,
  SubsectorData,
} from "./data";
import axios from "axios";
/*
import FakeServer from "./FakeServer";
const axios = new FakeServer();
*/
type Result<T> = { data: T[] };
const url = process.env.REACT_APP_API_URL; // `http://${window.location.host}`
const userUrl = `${url}/user_modify/`;
const apiTokenAuth = `${url}/api-token-auth/`;
const plantUrl = `${url}/api/plant/`;
const secUrl = `${url}/api/sec/`;
const subsecUrl = `${url}/api/subsec/`;
const empUrl = `${url}/api/emp/`;
const deptUrl = `${url}/api/dept/`;
const skillUrl = `${url}/api/skill/`;
const jobUrl = `${url}/api/job/`;
const empSkillUrl = `${url}/api/emp_skill/`;
const jobSkillUrl = `${url}/api/job_skill/`;

const getCookie = (name: string) => {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

class Fetcher {
  private static token: string | null = localStorage.getItem("Token");

  public static setToken = (token?: string) => {
    if (token) {
      Fetcher.token = token;
    } else {
      Fetcher.token = null;
    }
  };

  public static saveToken = () => {
    if (Fetcher.token) {
      localStorage.setItem("Token", Fetcher.token);
    } else {
      localStorage.removeItem("Token");
    }
  };

  private static getConfig = () => {
    let headers: { [s:string]: any} = {};
    let csrf = getCookie("csrftoken");
    csrf && (headers["X-CSRFToken"] = csrf);
    Fetcher.token && (headers["Authorization"] = `Token ${Fetcher.token}`);
    let config = {
      headers
    }
    return config;
  };

  static login = async (username: string, password: string) => {
    let res = await axios.post(apiTokenAuth, { username, password });
    if (res.data.token) {
      Fetcher.setToken(res.data.token);
    }
    return res;
  };

  static logout = () => {
    Fetcher.setToken();
    Fetcher.saveToken();
  };

  static isLoggedIn = () => !!Fetcher.token;

  // GET
  static getUser = async (): Promise<any> => {
    return await axios.get(userUrl, Fetcher.getConfig());
  };

  static getPlants = async (): Promise<Result<PlantData>> => {
    return await axios.get(plantUrl, Fetcher.getConfig());
  };

  static getSecs = async (): Promise<Result<SectorData>> => {
    return await axios.get(secUrl, Fetcher.getConfig());
  };

  static getSubsecs = async (): Promise<Result<SubsectorData>> => {
    return await axios.get(subsecUrl, Fetcher.getConfig());
  };

  static getEmps = async (): Promise<Result<EmployeeData>> => {
    return await axios.get(empUrl, Fetcher.getConfig());
  };

  static getDepts = async (): Promise<Result<DepartmentData>> => {
    return await axios.get(deptUrl, Fetcher.getConfig());
  };

  static getSkills = async (): Promise<Result<SkillData>> => {
    return await axios.get(skillUrl, Fetcher.getConfig());
  };

  static getJobs = async (): Promise<Result<JobData>> => {
    return await axios.get(jobUrl, Fetcher.getConfig());
  };

  static getJobSkills = async (): Promise<Result<JobSkillData>> => {
    return await axios.get(jobSkillUrl, Fetcher.getConfig());
  };

  static getEmpSkills = async (): Promise<Result<EmpSkillData>> => {
    return await axios.get(empSkillUrl, Fetcher.getConfig());
  };

  // POST
  static postPlant = async (data: PlantData): Promise<Result<PlantData>> => {
    try {
      return await axios.post(plantUrl, data, Fetcher.getConfig());
    } catch (e) {
      return Promise.reject(e);
    }
    
  };

  static postSec = async (data: SectorData): Promise<Result<SectorData>> => {
    return await axios.post(secUrl, data, Fetcher.getConfig());
  };

  static postSubsec = async (
    data: SubsectorData
  ): Promise<Result<SubsectorData>> => {
    return await axios.post(subsecUrl, data, Fetcher.getConfig());
  };

  static postEmp = async (
    data: EmployeeData
  ): Promise<Result<EmployeeData>> => {
    return await axios.post(empUrl, data, Fetcher.getConfig());
    /*
    let fd = new FormData();
    console.log(Object.entries(data));
    Object.entries(data).forEach((x) => {
      x[1] && fd.append(x[0], x[1]);
    });
    fd.delete("skills", Fetcher.getConfig());
    console.log([...fd.entries()]);
    let ans;
    try {
      ans = await axios.post(empUrl, fd);
    } catch (error) {
      console.log(error);
      throw error;
    }
    console.log(ans);
    return ans;*/
  };

  static postDept = async (
    data: DepartmentData
  ): Promise<Result<DepartmentData>> => {
    return await axios.post(deptUrl, data, Fetcher.getConfig());
  };

  static postSkill = async (data: SkillData): Promise<Result<SkillData>> => {
    return await axios.post(skillUrl, data, Fetcher.getConfig());
  };

  static postJob = async (data: JobData): Promise<Result<JobData>> => {
    return await axios.post(jobUrl, data, Fetcher.getConfig());
  };

  static postJobSkill = async (
    data: JobSkillData
  ): Promise<Result<JobSkillData>> => {
    return await axios.post(jobSkillUrl, data, Fetcher.getConfig());
  };

  static postEmpSkill = async (
    data: EmpSkillData
  ): Promise<Result<EmpSkillData>> => {
    return await axios.post(empSkillUrl, data, Fetcher.getConfig());
  };

  static putPlant = async (data: PlantData): Promise<Result<PlantData>> => {
    return await axios.put(`${plantUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putSec = async (data: SectorData): Promise<Result<SectorData>> => {
    return await axios.put(`${secUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putSubsec = async (
    data: SubsectorData
  ): Promise<Result<SubsectorData>> => {
    return await axios.put(`${subsecUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putEmp = async (data: EmployeeData): Promise<Result<EmployeeData>> => {
    return await axios.put(`${empUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putDept = async (
    data: DepartmentData
  ): Promise<Result<DepartmentData>> => {
    return await axios.put(`${deptUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putSkill = async (data: SkillData): Promise<Result<SkillData>> => {
    return await axios.put(`${skillUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putJob = async (data: JobData): Promise<Result<JobData>> => {
    return await axios.put(`${jobUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putJobSkill = async (
    data: JobSkillData
  ): Promise<Result<JobSkillData>> => {
    return await axios.put(`${jobSkillUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putEmpSkill = async (
    data: EmpSkillData
  ): Promise<Result<EmpSkillData>> => {
    return await axios.put(`${empSkillUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putUser = async (username: string, password: string) => {
    return await axios.put(userUrl, { username, password }, Fetcher.getConfig());
  }

  static deleteEmp = async (
    data: EmployeeData
  ): Promise<Result<EmployeeData>> => {
    return await axios.delete(`${empUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deletePlant = async (data: PlantData): Promise<Result<PlantData>> => {
    return await axios.delete(`${plantUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteSec = async (data: SectorData): Promise<Result<SectorData>> => {
    return await axios.delete(`${secUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteSubsec = async (
    data: SubsectorData
  ): Promise<Result<SubsectorData>> => {
    return await axios.delete(`${subsecUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteDept = async (
    data: DepartmentData
  ): Promise<Result<DepartmentData>> => {
    return await axios.delete(`${deptUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteSkill = async (data: SkillData): Promise<Result<SkillData>> => {
    return await axios.delete(`${skillUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteJob = async (data: JobData): Promise<Result<JobData>> => {
    return await axios.delete(`${jobUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteJobSkill = async (
    data: JobSkillData
  ): Promise<Result<JobSkillData>> => {
    return await axios.delete(`${jobSkillUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteEmpSkill = async (
    data: EmpSkillData
  ): Promise<Result<EmpSkillData>> => {
    return await axios.delete(`${empSkillUrl}${data.id}/`, Fetcher.getConfig());
  };
}

export default Fetcher;
