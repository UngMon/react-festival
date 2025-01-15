import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Comment } from "../type/UserDataType";

const initialState: Record<"comment", Comment[]> = { comment: [] };

const originCommentSlice = createSlice({
  name: "origin_comment",
  initialState,
  reducers: {
    setComment(state, action: PayloadAction<{ comment_datas: Comment[] }>) {
      state.comment = [...action.payload.comment_datas];
    },
    addNewComment(state, action: PayloadAction<{ field_data: Comment }>) {
      console.log(action.payload.field_data);

      state.comment.unshift(action.payload.field_data);
    },
    updateComment(
      state,
      action: PayloadAction<{
        origin_index: number;
        type: string;
        updatedField?: Comment;
      }>
    ) {
      const { origin_index, type, updatedField } = action.payload;

      if (origin_index < 0 || origin_index > state.comment.length) {
        console.error("Invalid index");
        return;
      }

      let final_data: Comment;
      console.log(type);
      if (type === "reply") {
        final_data = JSON.parse(JSON.stringify(state.comment[origin_index]));
        final_data.reply_count -= 1;
      } else final_data = updatedField!;

      state.comment[origin_index] = final_data;
    },
    deleteComment(state, action: PayloadAction<{ origin_index: number }>) {
      const origin_index = action.payload.origin_index;

      if (origin_index < 0 || origin_index > state.comment.length) {
        console.error("Invalid index");
        return;
      }

      state.comment.splice(origin_index, 1);
    },
  },
});

export const originCommentActions = originCommentSlice.actions;
export const originCommentReducer = originCommentSlice.reducer;
