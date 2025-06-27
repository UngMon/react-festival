import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Comment, ReplyComment } from "type/DataType";

interface LikeCommentPayload {
  origin_id: string;
  reply_index: number;
  user_id: string;
  like_count: number;
}

interface RevisePayload {
  origin_id: string;
  reply_index: number;
  content: [string, string, string];
}

interface DeletePayload {
  reply_index?: number;
  origin_id: string;
}

const initialState: ReplyComment = {
  reply_comments: {},
  afterIndex: "",
};

const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    setNewReply(
      state,
      action: PayloadAction<{
        origin_id: string;
        comment_datas: Comment[];
        lastDataIndex: string;
      }>
    ) {
      const { origin_id, comment_datas, lastDataIndex } = action.payload;
      if (!state.reply_comments[origin_id])
        state.reply_comments[origin_id] = [];
      state.reply_comments[origin_id].push(...comment_datas);
      state.afterIndex = lastDataIndex;
    },
    addNewReply(
      state,
      action: PayloadAction<{ key: string; comment_data: Comment }>
    ) {
      const { key, comment_data } = action.payload;
      if (state.reply_comments[key])
        state.reply_comments[key].push(comment_data);
    },
    likeComment(state, action: PayloadAction<LikeCommentPayload>) {
      const { origin_id, reply_index, user_id, like_count } = action.payload;
      const comment = state.reply_comments[origin_id];

      if (!comment) {
        console.error("origin_id does not exist");
        return;
      }

      if (reply_index < 0 || reply_index >= comment.length) {
        console.error("Invalid reply index:", reply_index);
        return;
      }

      const reply = comment[reply_index];
      reply.like_count += like_count;

      if (like_count === 1) {
        reply.like_users.push(user_id);
      } else if (like_count === -1) {
        const index = reply.like_users.indexOf(user_id);

        if (index === -1 || reply.like_users.length <= index) return;

        comment[reply_index].like_users.splice(index, 1);
      }
    },
    reviseComment(state, action: PayloadAction<RevisePayload>) {
      const { origin_id, reply_index, content } = action.payload;
      const comment = state.reply_comments[origin_id];

      if (!comment) {
        console.error("origin_id does not exist");
        return;
      }

      if (reply_index < 0 || reply_index >= comment.length) {
        console.error("Invalid reply index:", reply_index);
        return;
      }

      state.reply_comments[origin_id][reply_index].content = content;
      state.reply_comments[origin_id][reply_index].isRevised = true;
    },
    deleteReply(state, action: PayloadAction<DeletePayload>) {
      const { reply_index, origin_id } = action.payload;
      const comment = state.reply_comments[origin_id];

      if (reply_index !== undefined) {
        // 오리지널 댓글의 답글을 삭제한 경우
        if (reply_index < 0 || reply_index >= comment.length) {
          console.error("Invalid reply index:", reply_index);
          return;
        }
        comment.splice(reply_index, 1);
      } else delete state.reply_comments[origin_id];
      // 오리지널 댓글을 삭제한 경우
    },
  },
});

export const replyActions = replySlice.actions;
export const replyReducer = replySlice.reducer;
