import { Data } from "./Data";

interface CalEventData extends Data {
  title: string;
  start: string;
  end: string;
  event_type: string;
}

export type { CalEventData } ;
