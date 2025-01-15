import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Comment } from "../type/UserDataType";

const initialState: Record<string, Record<string, Comment>> = {};

const myReplySlice = createSlice({
  name: "my_reply",
  initialState,
  reducers: {
    addNewMyReply(
      state,
      action: PayloadAction<{
        origin_id: string;
        comment_id: string;
        comment_data: Comment;
      }>
    ) {
      const { origin_id, comment_id, comment_data } = action.payload;
      if (!state[origin_id]) state[origin_id] = {};
      state[origin_id][comment_id] = comment_data;
    },
    updateMyReply(
      state,
      action: PayloadAction<{
        origin_id: string;
        comment_id: string;
        updatedField: Comment;
      }>
    ) {
      const { origin_id, comment_id, updatedField } = action.payload;
      state[origin_id][comment_id] = updatedField;
    },
    deleteMyReply(
      state,
      action: PayloadAction<{ origin_id: string; comment_id?: string }>
    ) {
      const { origin_id, comment_id } = action.payload;
      if (comment_id) delete state[origin_id][comment_id];
      else delete state[origin_id];
    },
  },
});

export const myReplyActions = myReplySlice.actions;
export const myReplyReducer = myReplySlice.reducer;
