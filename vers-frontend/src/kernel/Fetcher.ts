import {
  EmployeeData,
  JobData,
  PlantData,
  SectorData,
  SkillData,
  SubsectorData,
  LogData,
  ForecastData,
  CalEventData,
  UserData,
  EmpFileData,
  EmpProfilePicData,
} from "./data";
import axios, { AxiosResponse } from "axios";

export type Result<T> = AxiosResponse<T>;
let host =
  process.env.NODE_ENV !== "production"
    ? process.env.REACT_APP_REST_API_URL
    : window.location.origin;

let socHost =
  process.env.NODE_ENV !== "production"
    ? process.env.REACT_APP_SOC_URL
    : `ws://${window.location.host}`;

let xlsxTemplateHost = `${process.env.MEDIA_URL}${process.env.REACT_APP_EXCEL_TEMPLATE_PATH}`;

const userUrl = `${host}${process.env.REACT_APP_REST_USER_MODIFY_PATH}/`;
const apiTokenAuth = `${host}${process.env.REACT_APP_REST_TOKEN_AUTH_PATH}/`;
const plantUrl = `${host}${process.env.REACT_APP_REST_API_PLANT_PATH}/`;
const secUrl = `${host}${process.env.REACT_APP_REST_API_SECTOR_PATH}/`;
const subsecUrl = `${host}${process.env.REACT_APP_REST_API_SUBSECTOR_PATH}/`;
const empUrl = `${host}${process.env.REACT_APP_REST_API_EMP_PATH}/`;
const empFileUrl = `${host}${process.env.REACT_APP_REST_API_EMP_FILE_PATH}/`;
const empProfilePicUrl = `${host}${process.env.REACT_APP_REST_API_EMP_PROFILE_PIC_PATH}`;
const skillUrl = `${host}${process.env.REACT_APP_REST_API_SKILL_PATH}/`;
const jobUrl = `${host}${process.env.REACT_APP_REST_API_JOB_PATH}/`;
const logUrl = `${host}${process.env.REACT_APP_REST_API_LOG_PATH}/`;
const logDelUrl = `${host}${process.env.REACT_APP_REST_API_LOG_DELETE_PATH}/`;
const forecastUrl = `${host}${process.env.REACT_APP_REST_API_FORECAST_PATH}/`;
const calEventUrl = `${host}${process.env.REACT_APP_REST_API_CAL_EVENT_PATH}/`;
const allUserUrl = `${host}${process.env.REACT_APP_REST_API_USER_PATH}/`;
const socUrl = `${socHost}${process.env.REACT_APP_SOC_MAIN_PATH}`;

export const plantExcelUrl = `${xlsxTemplateHost}${process.env.REACT_APP_EXCEL_PLANT_PATH}`;
export const sectorExcelUrl = `${xlsxTemplateHost}${process.env.REACT_APP_EXCEL_SECTOR_PATH}`;
export const subsectorExcelUrl = `${xlsxTemplateHost}${process.env.REACT_APP_EXCEL_SUBSECTOR_PATH}`;
export const skillExcelUrl = `${xlsxTemplateHost}${process.env.REACT_APP_EXCEL_SKILL_PATH}`;
export const empExcelUrl = `${xlsxTemplateHost}${process.env.REACT_APP_EXCEL_EMPLOYEE_PATH}`;
export const calExcelUrl = `${xlsxTemplateHost}${process.env.REACT_APP_EXCEL_CAL_EVENT_PATH}`;
export const forecastExcelUrl = `${xlsxTemplateHost}${process.env.REACT_APP_EXCEL_FORECAST_PATH}`;

const getCookie = (name: string) => {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (let c of cookies) {
      let cookie = c.trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

function convToFormData(data: any) {
  const formData = new FormData();
  for (let [k, v] of Object.entries(data)) {
    if (v === undefined) continue;
    if (typeof v === "object" && !(v instanceof File)) {
      formData.append(k, JSON.stringify(v));
    } else {
      formData.append(k, v as string | File);
    }
  }
  return formData;
}

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

  public static getSoc = () => {
    let u = socUrl;
    if (Fetcher.token) u = u.concat(`?token=${Fetcher.token}`);
    try {
      return new WebSocket(u);
    } catch (e) {
      return;
    }
  };

  private static getConfig = (initHeaders?: any) => {
    let headers: { [s: string]: any } = { ...initHeaders };
    let csrf = getCookie("csrftoken");
    csrf && (headers["X-CSRFToken"] = csrf);
    Fetcher.token && (headers["Authorization"] = `Token ${Fetcher.token}`);
    return {
      headers,
    };
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
    return axios.get(userUrl, Fetcher.getConfig());
  };

  static getPlants = async (): Promise<Result<PlantData[]>> => {
    return axios.get(plantUrl, Fetcher.getConfig());
  };

  static getSecs = async (): Promise<Result<SectorData[]>> => {
    return axios.get(secUrl, Fetcher.getConfig());
  };

  static getSubsecs = async (): Promise<Result<SubsectorData[]>> => {
    return axios.get(subsecUrl, Fetcher.getConfig());
  };

  static getEmps = async (): Promise<Result<EmployeeData[]>> => {
    return axios.get(empUrl, Fetcher.getConfig());
  };

  static getSkills = async (): Promise<Result<SkillData[]>> => {
    return axios.get(skillUrl, Fetcher.getConfig());
  };

  static getJobs = async (): Promise<Result<JobData[]>> => {
    return axios.get(jobUrl, Fetcher.getConfig());
  };

  static getLogs = async (): Promise<Result<LogData[]>> => {
    return axios.get(logUrl, Fetcher.getConfig());
  };

  static getForecasts = async (): Promise<Result<ForecastData[]>> => {
    return axios.get(forecastUrl, Fetcher.getConfig());
  };

  static getCalEvents = async (): Promise<Result<CalEventData[]>> => {
    return axios.get(calEventUrl, Fetcher.getConfig());
  };

  static getUsers = async (): Promise<Result<UserData[]>> => {
    return axios.get(allUserUrl, Fetcher.getConfig());
  };

  // POST
  static postPlant = async (data: PlantData): Promise<Result<PlantData>> => {
    return axios.post(plantUrl, data, Fetcher.getConfig());
  };

  static postSec = async (data: SectorData): Promise<Result<SectorData>> => {
    return axios.post(secUrl, data, Fetcher.getConfig());
  };

  static postSubsec = async (
    data: SubsectorData
  ): Promise<Result<SubsectorData>> => {
    return axios.post(subsecUrl, data, Fetcher.getConfig());
  };

  static postEmp = async (
    data: EmployeeData
  ): Promise<Result<EmployeeData>> => {
    return axios.post(empUrl, data, Fetcher.getConfig());
  };

  static postEmpProfilePic = async (data: EmpProfilePicData) => {
    return axios.post(
      empProfilePicUrl,
      convToFormData(data),
      Fetcher.getConfig()
    );
  };

  static postEmpFile = async (data: EmpFileData) => {
    return axios.post(
      empFileUrl,
      convToFormData(data),
      Fetcher.getConfig({ "Content-Type": "multipart/form-data" })
    );
  };

  static postSkill = async (data: SkillData): Promise<Result<SkillData>> => {
    return axios.post(skillUrl, data, Fetcher.getConfig());
  };

  static postJob = async (data: JobData): Promise<Result<JobData>> => {
    return axios.post(jobUrl, data, Fetcher.getConfig());
  };

  static postForecast = async (
    data: ForecastData
  ): Promise<Result<ForecastData>> => {
    return axios.post(forecastUrl, data, Fetcher.getConfig());
  };

  static postCalEvent = async (
    data: CalEventData
  ): Promise<Result<CalEventData>> => {
    return axios.post(calEventUrl, data, Fetcher.getConfig());
  };

  static putPlant = async (data: PlantData): Promise<Result<PlantData>> => {
    return axios.put(`${plantUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putSec = async (data: SectorData): Promise<Result<SectorData>> => {
    return axios.put(`${secUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putSubsec = async (
    data: SubsectorData
  ): Promise<Result<SubsectorData>> => {
    return axios.put(
      `${subsecUrl}${data.id}/`,
      data,
      Fetcher.getConfig()
    );
  };

  static putEmp = async (data: EmployeeData): Promise<Result<EmployeeData>> => {
    return axios.put(`${empUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putEmpFile = async (data: EmpFileData) => {
    return axios.put(
      `${empFileUrl}${data.id}/`,
      convToFormData(data),
      Fetcher.getConfig({ "Content-Type": "multipart/form-data" })
    );
  };

  static putEmpProfilePic = async (data: EmpProfilePicData) => {
    return axios.put(
      `${empProfilePicUrl}${data.id}/`,
      convToFormData(data),
      Fetcher.getConfig()
    );
  };

  static putSkill = async (data: SkillData): Promise<Result<SkillData>> => {
    return axios.put(`${skillUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putJob = async (data: JobData): Promise<Result<JobData>> => {
    return axios.put(`${jobUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putUser = async (username: string, password: string) => {
    return axios.put(
      userUrl,
      { username, password },
      Fetcher.getConfig()
    );
  };

  static putOtherUser = async (data: UserData) => {
    return axios.put(
      `${allUserUrl}${data.id}/`,
      data,
      Fetcher.getConfig()
    );
  };

  static putForecast = async (
    data: ForecastData
  ): Promise<Result<ForecastData>> => {
    return axios.put(
      `${forecastUrl}${data.id}/`,
      data,
      Fetcher.getConfig()
    );
  };

  static putCalEvent = async (
    data: CalEventData
  ): Promise<Result<CalEventData>> => {
    return axios.put(
      `${calEventUrl}${data.id}/`,
      data,
      Fetcher.getConfig()
    );
  };

  static deleteEmp = async (
    data: EmployeeData
  ): Promise<Result<EmployeeData>> => {
    return axios.delete(`${empUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteEmpProfilePic = async (data: EmpProfilePicData) => {
    return axios.delete(
      `${empProfilePicUrl}${data.id}/`,
      Fetcher.getConfig()
    );
  };

  static deletePlant = async (data: PlantData): Promise<Result<PlantData>> => {
    return axios.delete(`${plantUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteSec = async (data: SectorData): Promise<Result<SectorData>> => {
    return axios.delete(`${secUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteSubsec = async (
    data: SubsectorData
  ): Promise<Result<SubsectorData>> => {
    return axios.delete(`${subsecUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteSkill = async (data: SkillData): Promise<Result<SkillData>> => {
    return axios.delete(`${skillUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteJob = async (data: JobData): Promise<Result<JobData>> => {
    return axios.delete(`${jobUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteLog = async (data: LogData): Promise<Result<LogData>> => {
    return axios.delete(`${logUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteForecast = async (
    data: ForecastData
  ): Promise<Result<ForecastData>> => {
    return axios.delete(`${forecastUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteCalEvent = async (
    data: CalEventData
  ): Promise<Result<CalEventData>> => {
    return axios.delete(`${calEventUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteUser = async (data: UserData): Promise<Result<UserData>> => {
    return axios.delete(`${allUserUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteEmpFile = async (data: EmpFileData) => {
    return axios.delete(`${empFileUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteAllLog = async () => {
    return axios.delete(logDelUrl, Fetcher.getConfig());
  };
}

export default Fetcher;
