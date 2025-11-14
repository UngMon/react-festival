import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommentType, ReplyComment } from "type/DataType";
import { fetchAndFilterReplies } from "api/fetchAndFilterReplies";

interface LikeCommentPayload {
  origin_id: string;
  reply_id: string;
  user_id: string;
  like_count: number;
}

interface RevisePayload {
  origin_id: string;
  reply_id: string;
  text: string;
  updatedAt: string;
}

interface DeletePayload {
  origin_id: string;
  comment_id?: string;
}

const initialState: ReplyComment = {
  reply_comments: {},
  last_index: {},
};

const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    setNewReply(
      state,
      action: PayloadAction<{
        origin_id: string;
        comment_datas: CommentType[];
        lastDataIndex: string;
      }>
    ) {
      const { origin_id, comment_datas, lastDataIndex } = action.payload;
      if (!state.reply_comments[origin_id])
        state.reply_comments[origin_id] = [];
      state.reply_comments[origin_id].push(...comment_datas);
      state.last_index[origin_id] = lastDataIndex;
    },
    addNewReply(
      state,
      action: PayloadAction<{ key: string; comment_data: CommentType }>
    ) {
      const { key, comment_data } = action.payload;
      if (state.reply_comments[key])
        state.reply_comments[key].push(comment_data);
    },
    likeComment(state, action: PayloadAction<LikeCommentPayload>) {
      const { origin_id, reply_id, user_id, like_count } = action.payload;
      const reply_comment = state.reply_comments[origin_id];

      if (!reply_comment) {
        console.error("Invalid Origin Id");
        return;
      }

      const reply_index = reply_comment.findIndex(
        (item) => item.createdAt + item.user_id === reply_id
      );

      if (reply_index === -1 || reply_index >= reply_comment.length) {
        console.error("Invalid Reply Index:", reply_index);
        return;
      }

      const reply_data = reply_comment[reply_index];
      reply_data.like_count += like_count;

      if (like_count === 1) delete reply_data.like_users[user_id];
      else if (like_count === -1) reply_data.like_users[user_id] = true;
    },
    reviseComment(state, action: PayloadAction<RevisePayload>) {
      const { origin_id, text, updatedAt, reply_id } = action.payload;

      const reply_comment = state.reply_comments[origin_id];

      if (!reply_comment) {
        console.error("Reply does not exist");
        return;
      }

      const reply_index = state.reply_comments[origin_id].findIndex(
        (item) => item.createdAt + item.user_id === reply_id
      );

      if (reply_index === -1 || reply_index >= reply_comment.length) {
        console.error("Invalid reply index:", reply_index);
        return;
      }

      state.reply_comments[origin_id][reply_index].text = text;
      state.reply_comments[origin_id][reply_index].updatedAt = updatedAt;
    },
    deleteReply(state, action: PayloadAction<DeletePayload>) {
      const { origin_id, comment_id } = action.payload;

      const comment = state.reply_comments[origin_id];

      if (!comment) {
        // console.error("Original Dose not exist reply slice");
        return;
      }

      if (!comment_id) {
        delete state.reply_comments[origin_id];
        return;
      }

      const reply_index = state.reply_comments[origin_id].findIndex(
        (item) => item.createdAt + item.user_id === comment_id
      );

      if (reply_index === -1 || reply_index >= comment.length) {
        console.error("Invalid reply index:", reply_index);
        return;
      }

      // origin 댓글의 답글을 삭제할 때,
      state.reply_comments[origin_id].splice(reply_index, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAndFilterReplies.fulfilled, (state, action) => {
        const { origin_id, comment_datas, lastDataIndex } = action.payload;

        if (!state.reply_comments[origin_id]) {
          state.reply_comments[origin_id] = [];
        }

        state.reply_comments[origin_id].push(...comment_datas);
        state.last_index[origin_id] = lastDataIndex;
      })
      .addCase(fetchAndFilterReplies.rejected, (state, action) => {
        console.error("Failed to fetch replies:", action.payload);
      });
  },
});

export const replyActions = replySlice.actions;
export const replyReducer = replySlice.reducer;
