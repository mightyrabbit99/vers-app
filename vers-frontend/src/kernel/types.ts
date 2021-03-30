import { Result as SubmitResult } from "./Store";

export interface MyLog {
  desc: string;
  time: number;
  vals: SubmitResult[];
}
