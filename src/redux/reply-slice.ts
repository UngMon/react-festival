import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Comment } from "../type/UserDataType";

const initialState: Record<"comment", Record<string, Comment[]>> = {
  comment: {},
};

const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    setNewReply(
      state,
      action: PayloadAction<{ origin_id: string; comment_datas: Comment[] }>
    ) {
      const { origin_id, comment_datas } = action.payload;
      if (!state.comment[origin_id]) state.comment[origin_id] = [];
      state.comment[origin_id].push(...comment_datas);
    },
    addNewReply(
      state,
      action: PayloadAction<{ key: string; comment_data: Comment }>
    ) {
      const { key, comment_data } = action.payload;
      state.comment[key].push(comment_data);
    },
    updateReply(
      state,
      action: PayloadAction<{
        reply_index: number;
        origin_id: string;
        updatedField: Comment;
      }>
    ) {
      const { reply_index, origin_id, updatedField } = action.payload;
      state.comment[origin_id][reply_index] = updatedField;
    },
    deleteReply(
      state,
      action: PayloadAction<{
        reply_index?: number;
        origin_id: string;
      }>
    ) {
      const { reply_index, origin_id } = action.payload;
      if (origin_id && reply_index) {
        // 오리지널 댓글의 답글을 삭제한 경우
        state.comment[origin_id].splice(reply_index, 1);
      }

      if (origin_id && !reply_index) {
        // 오리지널 댓글을 삭제한 경우
        delete state.comment[origin_id];
      }
    },
  },
});

export const replyActions = replySlice.actions;
export const replyReducer = replySlice.reducer;
