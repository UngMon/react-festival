import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommentType, OriginComment } from "type/DataType";

interface LikeCommentPayload {
  comment_id: string;
  like_count: number;
  user_id: string;
}

interface ChangeReplyCountPayload {
  comment_id: string;
  type: "reply-reply" | "reply";
}

const initialState: OriginComment = { comments: [], afterIndex: "" };

const originCommentSlice = createSlice({
  name: "origin_comment",
  initialState,
  reducers: {
    setComment(
      state,
      action: PayloadAction<{
        comment_datas: CommentType[];
        startAfter: string;
      }>
    ) {
      const { comment_datas, startAfter } = action.payload;
      state.comments.push(...comment_datas);
      state.afterIndex = startAfter;
    },
    addNewComment(state, action: PayloadAction<{ field_data: CommentType }>) {
      state.comments.unshift(action.payload.field_data);
    },
    subtractionCount(state, action: PayloadAction<{ origin_id: string }>) {
      const { origin_id } = action.payload;
      const index = state.comments.findIndex(
        (comment) => comment.createdAt + comment.user_id === origin_id
      );
      if (index >= 0) state.comments[index].reply_count! -= 1;
    },
    likeComment(state, action: PayloadAction<LikeCommentPayload>) {
      const { comment_id, like_count, user_id } = action.payload;

      const comment_index = state.comments.findIndex(
        (item) => item.createdAt + item.user_id === comment_id
      );

      if (comment_index === -1 || comment_index >= state.comments.length) {
        console.error("Invalid index");
        return;
      }

      state.comments[comment_index].like_count += like_count;

      if (like_count === -1) {
        delete state.comments[comment_index].like_users[user_id];
      } else state.comments[comment_index].like_users[user_id] = true;
    },
    changeReplyCount(state, action: PayloadAction<ChangeReplyCountPayload>) {
      const { comment_id, type } = action.payload;

      const comment_index = state.comments.findIndex(
        (item) => item.createdAt + item.user_id === comment_id
      );

      if (comment_index < -1 || comment_index >= state.comments.length) {
        console.error("Invalid comment index:", comment_index);
        return;
      }

      const comment = state.comments[comment_index];

      if (comment.reply_count === undefined) {
        console.error("reply_count is undefined");
        return;
      }

      comment.reply_count += type === "reply-reply" ? 1 : -1;
    },
    reviseComment(
      state,
      action: PayloadAction<{
        text: string;
        comment_id: string;
        updatedAt: string;
      }>
    ) {
      const { comment_id, text, updatedAt } = action.payload;

      const comment_index = state.comments.findIndex(
        (item) => item.createdAt + item.user_id === comment_id
      );

      if (comment_index === -1) return;

      const comment = state.comments[comment_index];
      comment.updatedAt = updatedAt;
      comment.text = text;
    },
    deleteComment(state, action: PayloadAction<{ comment_id: string }>) {
      const comment_id = action.payload.comment_id;
      const comment_index = state.comments.findIndex(
        (item) => item.createdAt + item.user_id === comment_id
      );

      if (comment_index === -1) return;

      state.comments.splice(comment_index, 1);
    },
  },
});

export const originCommentActions = originCommentSlice.actions;
export const originCommentReducer = originCommentSlice.reducer;
