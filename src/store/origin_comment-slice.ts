import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Comment } from "type/DataType";

interface LikeCommentPayload {
  origin_index: number;
  like_count: number;
  user_id: string;
}

interface ChangeReplyCountPayload {
  origin_index: number;
  type: "reply-reply" | "reply";
}

const initialState: Record<"comment", Comment[]> = { comment: [] };

const originCommentSlice = createSlice({
  name: "origin_comment",
  initialState,
  reducers: {
    setComment(state, action: PayloadAction<{ comment_datas: Comment[] }>) {
      state.comment = [...action.payload.comment_datas];
    },
    addNewComment(state, action: PayloadAction<{ field_data: Comment }>) {
      state.comment.unshift(action.payload.field_data);
    },
    subtractionCount(state, action: PayloadAction<{ origin_id: string }>) {
      const { origin_id } = action.payload;
      const index = state.comment.findIndex(
        (comment) => comment.createdAt + comment.user_id === origin_id
      );
      console.log('Subtraction Count!!!!')
      if (index >= 0) state.comment[index].reply_count! -= 1;
    },
    likeComment(state, action: PayloadAction<LikeCommentPayload>) {
      const { origin_index, like_count, user_id } = action.payload;

      if (origin_index < 0 || origin_index >= state.comment.length) {
        console.error("Invalid index");
        return;
      }

      const comment = state.comment[origin_index];
      comment.like_count += like_count;

      if (like_count === -1) {
        const index = comment.like_users.indexOf(user_id);

        if (index === -1 || comment.like_users.length <= index) return;

        comment.like_users.splice(index, 1);
      } else if (like_count === 1) comment.like_users.push(user_id);
    },
    changeReplyCount(state, action: PayloadAction<ChangeReplyCountPayload>) {
      const { origin_index, type } = action.payload;
      const comment = state.comment[origin_index];

      if (origin_index < 0 || origin_index >= state.comment.length) {
        console.error("Invalid comment index:", origin_index);
        return;
      }

      if (comment.reply_count === undefined) {
        console.error("reply_count is undefined");
        return;
      }

      comment.reply_count += type === "reply-reply" ? 1 : -1;
    },
    reviseComment(
      state,
      action: PayloadAction<{
        origin_index: number;
        content: [string, string, string];
      }>
    ) {
      const { origin_index, content } = action.payload;
      const comment = state.comment[origin_index];
      if (comment) {
        comment.content = content;
        comment.isRevised = true;
      }
    },
    deleteComment(state, action: PayloadAction<{ origin_index: number }>) {
      const origin_index = action.payload.origin_index;

      if (origin_index < 0 || origin_index >= state.comment.length) {
        console.error("Invalid comment index:", origin_index);
        return;
      }

      state.comment.splice(origin_index, 1);
    },
  },
});

export const originCommentActions = originCommentSlice.actions;
export const originCommentReducer = originCommentSlice.reducer;
