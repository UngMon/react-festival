import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalType } from "types/UserDataType";

const initialState: ModalType = {
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
    toggleToastModal(
      state,
      action: PayloadAction<{
        api_state?: string;
        comment_id?: string;
        mode?: string;
      }>,
    ) {
      const { api_state, comment_id, mode } = action.payload;

      if (mode === "revise" && comment_id) {
        delete state.revise[comment_id];
      } else if (mode === "reply" && comment_id) {
        delete state.reply[comment_id];
      } 

      if (api_state) state.api_state = api_state;
      else state.api_state = "";

      state.openDelete = "";
      state.openOption = "";
      state.openReport = "";
    },
  },
});

export const modalActions = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
