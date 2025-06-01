import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Comment } from "type/DataType";

interface BasicPayload {
  origin_id: string;
  comment_id: string;
}

interface NewMyReplyPayload extends BasicPayload {
  comment_data: Comment;
}

interface LikeCommentPayload extends BasicPayload {
  user_id: string;
  like_count: number;
}

interface RevisePayload extends BasicPayload {
  content: [string, string, string];
}

const initialState: Record<string, Record<string, Comment>> = {};

const myReplySlice = createSlice({
  name: "my_reply",
  initialState,
  reducers: {
    addNewMyReply(state, action: PayloadAction<NewMyReplyPayload>) {
      const { origin_id, comment_id, comment_data } = action.payload;
      if (!state[origin_id]) state[origin_id] = {};
      state[origin_id][comment_id] = comment_data;
    },
    likeComment(state, action: PayloadAction<LikeCommentPayload>) {
      const { origin_id, comment_id, user_id, like_count } = action.payload;
      const comments = state[origin_id];

      if (!comments) {
        console.error("origin_id does not exist");
        return;
      }

      const myReply = comments[comment_id];

      if (!myReply) {
        console.error("comment_id does not exist");
        return;
      }

      myReply.like_count += like_count;

      if (like_count === 1) {
        myReply.like_users.push(user_id);
      } else if (like_count === -1) {
        const index = myReply.like_users.indexOf(user_id);

        if (index === -1 || myReply.like_users.length <= index) return;

        myReply.like_users.splice(index, 1);
      }
    },
    reviseComment(state, action: PayloadAction<RevisePayload>) {
      const { origin_id, comment_id, content } = action.payload;
      const comments = state[origin_id];

      if (!comments) {
        console.error("origin_id does not exist");
        return;
      }

      const myReply = comments[comment_id];

      if (!myReply) {
        console.error("comment_id does not exist");
        return;
      }

      myReply.content = content;
      myReply.isRevised = true;
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
