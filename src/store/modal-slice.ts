import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalType } from "type/UserDataType";

const initialState: ModalType = {
  current_id: "",
  openOption: "",
  openDelete: "",
  openReport: "",
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
    clearModalInfo(
      state,
      action: PayloadAction<{ comment_id?: string; type?: string }>
    ) {
      const { comment_id, type } = action.payload;

      if (type?.includes("revise") && comment_id)
        delete state.revise[comment_id];
      else if (type?.includes("reply") && comment_id)
        delete state.reply[comment_id];

      state.openDelete = "";
      state.openOption = "";
      state.openReport = "";
    },
  },
});

export const modalActions = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
