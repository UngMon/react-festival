import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PickComment } from "@/type/UserDataType";
import { Comment } from "@/type/DataType";

const initialState: PickComment = {
  open: "",
  delete: "",
  comment_id: "",
  comment_data: null,
  revise: {},
  reply: {},
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    clickReviseButton(state, action: PayloadAction<{ comment_id: string }>) {
      const comment_id: string = action.payload.comment_id;
      state.revise[comment_id] = "revise";
      state.comment_id = "";
      state.comment_data = null;
    },
    clickReplyButton(state, action: PayloadAction<{ comment_id: string }>) {
      state.reply[action.payload.comment_id] = "reply";
    },
    openDeleteModal(state, action: PayloadAction<{ comment_id: string }>) {
      state.delete = action.payload.comment_id;
      state.open = "";
    },
    openOptionModal(
      state,
      action: PayloadAction<{
        comment_id: string;
        comment_data: Comment;
      }>
    ) {
      const { comment_data, comment_id } = action.payload;
      state.open = comment_id;
      state.comment_data = comment_data;
      state.comment_id = comment_id;
    },
    clearModalInfo(
      state,
      action: PayloadAction<{ comment_id: string; type?: string }>
    ) {
      const { comment_id, type } = action.payload;

      if (type && comment_id) {
        if (type.includes("revise")) {
          delete state.revise[comment_id];
        } else if (type.includes("reply")) {
          delete state.reply[comment_id];
        }
      }

      state.comment_data = null;
      state.comment_id = "";
      state.delete = "";
      state.open = "";
    },
  },
});

export const modalActions = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
