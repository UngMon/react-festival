import { combineReducers } from "@reduxjs/toolkit";
import { tctsReducer } from "./tcts-slice";
import { festivalReducer } from "./festival-slice";
import { firebaseReducer } from "./firebase-slice";
import { cultureReducer } from "./culture-slice";
import { categoryReducer } from "./category-slice";

// combineReducers 함수를 사용하여 여러 개의 슬라이스 리듀서를 하나의 루트 리듀서로 결합할 수 있다.
const rootReducer = combineReducers({
  tcts: tctsReducer,
  culture: cultureReducer,
  festival: festivalReducer,
  firebase: firebaseReducer,
  category: categoryReducer,
});

export default rootReducer;
