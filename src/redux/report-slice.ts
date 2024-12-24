import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  content_type: "",
  content_id: "",
  content_title: "",
  createdAt: "",
  content: "",
  report_reason: "",
  reported_id: "",
  reported_name: "",
  reporter_id: "",
  reporter_name: "",
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setReport(state, action) {
      console.log(action.payload);
      state.open = true;
      state.content_type = action.payload.contentType;
      state.content_id = action.payload.contentId;
      state.content_title = action.payload.contentTitle;
      state.createdAt = action.payload.createdAt;
      state.content = action.payload.content;
      state.report_reason = action.payload.reason;
      state.reported_id = action.payload.uid;
      state.reported_name = action.payload.name ?? "";
      state.reporter_id = action.payload.reporterUid;
      state.reporter_name = action.payload.reporterName;
    },
    setClearState(state) {
      state.open = false;
      state.content_type = "";
      state.content_id = "";
      state.content_title = "";
      state.createdAt = "";
      state.content = "";
      state.report_reason = "";
      state.reported_id = "";
      state.reported_name = "";
      state.reporter_id = "";
      state.reporter_name = "";
    },
  },
});

export const reportActions = reportSlice.actions;
export const reportReducer = reportSlice.reducer;
