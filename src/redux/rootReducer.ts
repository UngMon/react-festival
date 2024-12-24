import { combineReducers } from "@reduxjs/toolkit";
import { dataReducer } from "./data-slice";
import { firebaseReducer } from "./firebase-slice";
import { reportReducer } from "./report-slice";

// combineReducers 함수를 사용하여 여러 개의 슬라이스 리듀서를 하나의 루트 리듀서로 결합할 수 있다.
const rootReducer = combineReducers({
  data: dataReducer,
  firebase: firebaseReducer,
  report: reportReducer,
});

export default rootReducer;
