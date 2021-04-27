import { AccessLevel, UserData } from "./data";
import Fetcher from "./Fetcher";
import store, { ItemT, ItemType } from "./Store";

interface User extends ItemT {
  _type: ItemType.User;
  username: string;
  is_superuser: boolean;
  is_active: boolean;
  vers_user: {
    plant_group: AccessLevel;
    sector_group: AccessLevel;
    subsector_group: AccessLevel;
    employee_group: AccessLevel;
    job_group: AccessLevel;
    skill_group: AccessLevel;
    forecast_group: AccessLevel;
  };
}

function dataToObj(x: UserData): User {
  return {
    _type: ItemType.User,
    non_field_errors: x.non_field_errors,
    ...x,
  };
}

function objToData(x: User): UserData {
  return {
    ...x,
  };
}

const generator = (init?: any): User => ({
  _type: ItemType.User,
  id: -1,
  name: "",
  sectors: [],
  ...init,
});

const get = async () => {
  let res = await Fetcher.getUsers();
  if (res.headers["content-type"] !== "application/json") return [];
  return res.data.map(dataToObj);
};

const post = async (t: User) => {
  return {
    success: false,
    statusText: "",
    data: null,
  };
};

const put = async (t: User) => {
  let res;
  try {
    res = await Fetcher.putOtherUser(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return {
    success: res.status === 200,
    statusText: res.statusText,
    data: dataToObj(res.data),
  };
};

const del = async (t: User) => {
  let res = await Fetcher.deleteUser(objToData(t));
  return { success: res.status === 204, statusText: res.statusText, data: {} };
};

const UserStore = store<User>(get, post, put, del, generator, dataToObj);

export type { User };
export { AccessLevel };
export default UserStore;
