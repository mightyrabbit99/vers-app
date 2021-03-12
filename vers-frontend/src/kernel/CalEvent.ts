import { CalEventData } from "./data";
import Fetcher from "./Fetcher";
import store, { Item, ItemType } from "./Store";

interface CalEvent extends Item {
  _type: ItemType.CalEvent;
  title: string;
  start: string;
  end: string;
  eventType: string;
}

function dataToObj(x: CalEventData): CalEvent {
  return {
    id: x.id,
    _type: ItemType.CalEvent,
    title: x.title,
    start: x.start,
    end: x.end,
    eventType: x.event_type,
  };
}

function objToData(x: CalEvent): CalEventData {
  return {
    id: x.id,
    title: x.title,
    start: x.start,
    end: x.end,
    event_type: x.eventType,
  };
}

const generator = (init?: any): CalEvent => ({
  _type: ItemType.CalEvent,
  id: -1,
  title: "",
  start: "",
  end: "",
  eventType: "",
  ...init,
});

const get = async () => {
  let res = await Fetcher.getCalEvents();
  return res.data.map(dataToObj);
};

const post = async (t: CalEvent) => {
  let res;
  try {
    res = await Fetcher.postCalEvent(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 201, statusText: res.statusText, data: dataToObj(res.data) };
};

const put = async (t: CalEvent) => {
  let res;
  try {
    res = await Fetcher.putCalEvent(objToData(t));
  } catch (error) {
    if (!error.response) throw error;
    res = error.response;
  }
  return { success: res.status === 200, statusText: res.statusText, data: dataToObj(res.data) };
};

const del = async (t: CalEvent) => {
  let res = await Fetcher.deleteCalEvent(objToData(t));
  return { success: res.status === 204, statusText: res.statusText, data: {} };
};

const hasher = (t: CalEvent) => t.name;

const CalEventStore = store<CalEvent>(get, post, put, del, generator, hasher);

export type { CalEvent };
export default CalEventStore;
