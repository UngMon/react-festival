import { combineReducers } from "@reduxjs/toolkit";
import { dataReducer } from "./data-slice";
import { firebaseReducer } from "./firebase-slice";
import { myReplyReducer } from "./my_reply-slice";
import { originCommentReducer } from "./origin_comment-slice";
import { replyReducer } from "./reply-slice";
import { modalReducer } from "./modal-slice";
import { contentReducer } from "./content-slice";

// combineReducers 함수를 사용하여 여러 개의 슬라이스 리듀서를 하나의 루트 리듀서로 결합할 수 있다.
const rootReducer = combineReducers({
  data: dataReducer,
  content: contentReducer,
  firebase: firebaseReducer,
  origin_comment: originCommentReducer,
  reply: replyReducer,
  myReply: myReplyReducer,
  modal: modalReducer,
});

export default rootReducer;
