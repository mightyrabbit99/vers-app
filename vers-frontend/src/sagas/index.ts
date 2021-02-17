import { SagaIterator } from "redux-saga";
import { fork } from "redux-saga/effects";

import DataSaga from "./DataSaga";
import SyncSaga from "./SyncSaga";
import SessionSaga from "./SessionSaga";

export default function* MainSaga(): SagaIterator {
  yield fork(DataSaga);
  yield fork(SyncSaga);
  yield fork(SessionSaga);
}
