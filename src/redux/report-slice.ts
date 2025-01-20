import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Comment, ReportType, UserData } from "../type/UserDataType";

const initialState: ReportType = {
  open: "",
  content_type: "",
  content_id: "",
  content_title: "",
  createdAt: "",
  content: "",
  report_reason: {},
  reported_id: "",
  reported_name: "",
  reporter_id: "",
  reporter_name: "",
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    checkList(state, action: PayloadAction<{ category: string }>) {
      const category = action.payload.category;

      if (state.report_reason[category]) {
        delete state.report_reason[category];
      } else {
        if (
          typeof state.report_reason !== "object" ||
          state.report_reason === null
        ) {
          state.report_reason = {};
        }

        state.report_reason[category] = category;
      }
    },
    setReport(
      state,
      action: PayloadAction<{
        userData: UserData;
        report_reason?: string;
        comment_data: Comment;
      }>
    ) {
      const {
        content_type,
        content_title,
        content_id,
        content,
        createdAt,
        user_id,
        user_name,
      } = action.payload.comment_data;

      const userData = action.payload.userData;

      Object.assign(state, {
        open: createdAt + user_id,
        content_type,
        content_title,
        content_id,
        content,
        createdAt,
        report_reason: action.payload.report_reason || "",
        reported_id: user_id,
        reported_name: user_name,
        reporter_id: userData.user_id,
        reporter_name: userData.user_name,
      });
    },
    setClearState(state) {
      state.open = "";
      state.content_type = "";
      state.content_id = "";
      state.content_title = "";
      state.createdAt = "";
      state.content = "";
      state.report_reason = {};
      state.reported_id = "";
      state.reported_name = "";
      state.reporter_id = "";
      state.reporter_name = "";
    },
  },
});

export const reportActions = reportSlice.actions;
export const reportReducer = reportSlice.reducer;
