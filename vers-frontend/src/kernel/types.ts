import { Result as SubmitResult, ItemT } from "./Store";

export interface MyLog {
  desc: string;
  time: number;
  vals: SubmitResult<any>[];
}

export type Feedback<T> = ItemT & Partial<T>;
