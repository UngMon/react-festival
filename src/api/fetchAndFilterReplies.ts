import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCommentData } from "./firestoreUtils";
import { RootState } from "store/store";

export const fetchAndFilterReplies = createAsyncThunk(
  "reply/fetchAndFilterReplies",
  async (
    { origin_id, content_id }: { origin_id: string; content_id: string },
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const last_index = state.reply.last_index[origin_id];
      const myReply = state.myReply[origin_id] || {};

      if (last_index === "finish") {
        // 이미 모든 데이터를 로드했으면 중단
        return thunkAPI.rejectWithValue("No more data");
      }

      // 4. API 호출
      const { comment_datas, lastDataIndex } = await fetchCommentData(
        origin_id,
        last_index,
        content_id
      );

      // 5. 핵심: Thunk 내부에서 필터링
      const filtered_datas = comment_datas.filter((item) => {
        const replyKey = item.createdAt + item.user_id;
        return myReply[replyKey] === undefined; // myReply에 없는 것만 필터링
      });

      // 6. 성공 시 반환할 값 (origin_id, 필터링된 데이터, 다음 인덱스)
      return { origin_id, comment_datas: filtered_datas, lastDataIndex };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
