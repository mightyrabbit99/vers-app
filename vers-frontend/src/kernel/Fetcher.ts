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
const empFileUrl = `${host}${process.env.REACT_APP_REST_API_EMP_FILE_PATH}`;
const skillUrl = `${host}${process.env.REACT_APP_REST_API_SKILL_PATH}/`;
const jobUrl = `${host}${process.env.REACT_APP_REST_API_JOB_PATH}/`;
const logUrl = `${host}${process.env.REACT_APP_REST_API_LOG_PATH}/`;
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

function buildFormData(formData: FormData, data: any, parentKey?: string) {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach(key => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value = data == null ? '' : data;
    formData.append(parentKey as string, value);
  }
}

function convToFormData(data: any) {
  const formData = new FormData();
  buildFormData(formData, data);
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

  private static getConfig = () => {
    let headers: { [s: string]: any } = {};
    let csrf = getCookie("csrftoken");
    csrf && (headers["X-CSRFToken"] = csrf);
    Fetcher.token && (headers["Authorization"] = `Token ${Fetcher.token}`);
    let config = {
      headers,
    };
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

  static getPlants = async (): Promise<Result<PlantData[]>> => {
    return await axios.get(plantUrl, Fetcher.getConfig());
  };

  static getSecs = async (): Promise<Result<SectorData[]>> => {
    return await axios.get(secUrl, Fetcher.getConfig());
  };

  static getSubsecs = async (): Promise<Result<SubsectorData[]>> => {
    return await axios.get(subsecUrl, Fetcher.getConfig());
  };

  static getEmps = async (): Promise<Result<EmployeeData[]>> => {
    return await axios.get(empUrl, Fetcher.getConfig());
  };

  static getSkills = async (): Promise<Result<SkillData[]>> => {
    return await axios.get(skillUrl, Fetcher.getConfig());
  };

  static getJobs = async (): Promise<Result<JobData[]>> => {
    return await axios.get(jobUrl, Fetcher.getConfig());
  };

  static getLogs = async (): Promise<Result<LogData[]>> => {
    return await axios.get(logUrl, Fetcher.getConfig());
  };

  static getForecasts = async (): Promise<Result<ForecastData[]>> => {
    return await axios.get(forecastUrl, Fetcher.getConfig());
  };

  static getCalEvents = async (): Promise<Result<CalEventData[]>> => {
    return await axios.get(calEventUrl, Fetcher.getConfig());
  };

  static getUsers = async (): Promise<Result<UserData[]>> => {
    return await axios.get(allUserUrl, Fetcher.getConfig());
  };

  // POST
  static postPlant = async (data: PlantData): Promise<Result<PlantData>> => {
    return await axios.post(plantUrl, data, Fetcher.getConfig());
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
    return await axios.post(empUrl, convToFormData(data), Fetcher.getConfig());
  };

  static postSkill = async (data: SkillData): Promise<Result<SkillData>> => {
    return await axios.post(skillUrl, data, Fetcher.getConfig());
  };

  static postJob = async (data: JobData): Promise<Result<JobData>> => {
    return await axios.post(jobUrl, data, Fetcher.getConfig());
  };

  static postForecast = async (
    data: ForecastData
  ): Promise<Result<ForecastData>> => {
    return await axios.post(forecastUrl, data, Fetcher.getConfig());
  };

  static postCalEvent = async (
    data: CalEventData
  ): Promise<Result<CalEventData>> => {
    return await axios.post(calEventUrl, data, Fetcher.getConfig());
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
    return await axios.put(
      `${subsecUrl}${data.id}/`,
      data,
      Fetcher.getConfig()
    );
  };

  static putEmp = async (data: EmployeeData): Promise<Result<EmployeeData>> => {
    return await axios.put(`${empUrl}${data.id}/`, convToFormData(data), Fetcher.getConfig());
  };

  static putSkill = async (data: SkillData): Promise<Result<SkillData>> => {
    return await axios.put(`${skillUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putJob = async (data: JobData): Promise<Result<JobData>> => {
    return await axios.put(`${jobUrl}${data.id}/`, data, Fetcher.getConfig());
  };

  static putUser = async (username: string, password: string) => {
    return await axios.put(
      userUrl,
      { username, password },
      Fetcher.getConfig()
    );
  };

  static putOtherUser = async (data: UserData) => {
    return await axios.put(
      `${allUserUrl}${data.id}/`,
      data,
      Fetcher.getConfig()
    );
  };

  static putForecast = async (
    data: ForecastData
  ): Promise<Result<ForecastData>> => {
    return await axios.put(
      `${forecastUrl}${data.id}/`,
      data,
      Fetcher.getConfig()
    );
  };

  static putCalEvent = async (
    data: CalEventData
  ): Promise<Result<CalEventData>> => {
    return await axios.put(
      `${calEventUrl}${data.id}/`,
      data,
      Fetcher.getConfig()
    );
  };

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

  static deleteSkill = async (data: SkillData): Promise<Result<SkillData>> => {
    return await axios.delete(`${skillUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteJob = async (data: JobData): Promise<Result<JobData>> => {
    return await axios.delete(`${jobUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteLog = async (data: LogData): Promise<Result<LogData>> => {
    return await axios.delete(`${logUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteForecast = async (
    data: ForecastData
  ): Promise<Result<ForecastData>> => {
    return await axios.delete(`${forecastUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteCalEvent = async (
    data: CalEventData
  ): Promise<Result<CalEventData>> => {
    return await axios.delete(`${calEventUrl}${data.id}/`, Fetcher.getConfig());
  };

  static deleteUser = async (data: UserData): Promise<Result<UserData>> => {
    return await axios.delete(`${allUserUrl}${data.id}/`, Fetcher.getConfig());
  };
}

export default Fetcher;
