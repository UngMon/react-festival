import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalType } from "type/UserDataType";

const initialState: ModalType = {
  current_id: "",
  openOption: "",
  openDelete: "",
  openReport: "",
  open_toast: false,
  api_state: "",
  revise: {},
  reply: {},
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    clickReviseButton(state, action: PayloadAction<{ comment_id: string }>) {
      state.revise[action.payload.comment_id] = true;
    },
    clickReplyButton(state, action: PayloadAction<{ comment_id: string }>) {
      state.reply[action.payload.comment_id] = true;
    },
    openDeleteModal(state, action: PayloadAction<{ comment_id: string }>) {
      state.openDelete = action.payload.comment_id;
      state.openOption = "";
      state.openReport = "";
    },
    openOptionModal(state, action: PayloadAction<{ comment_id: string }>) {
      state.openOption = action.payload.comment_id;
      state.openDelete = "";
      state.openReport = "";
    },
    openReportModal(state, action: PayloadAction<{ comment_id: string }>) {
      state.openReport = action.payload.comment_id;
      state.openDelete = "";
      state.openOption = "";
    },
    toggleToastModal(state, action: PayloadAction<{ api_state?: string }>) {
      const api_state = action.payload.api_state;

      if (api_state) state.api_state = api_state;
      else state.api_state = "";
    },
    clearModalInfo(
      state,
      action: PayloadAction<{
        comment_id?: string;
        type?: string;
      }>
    ) {
      const { comment_id, type } = action.payload;

      if (type?.includes("revise") && comment_id)
        delete state.revise[comment_id];
      else if (type?.includes("reply") && comment_id)
        delete state.reply[comment_id];
      else if (type?.includes("delete")) {
        state.api_state = "댓글을 삭제 중입니다.";
      } else if (type?.includes("report")) {
        state.api_state = "댓글을 신고 중입니다.";
      }

      state.openDelete = "";
      state.openOption = "";
      state.openReport = "";
    },
  },
});

export const modalActions = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
