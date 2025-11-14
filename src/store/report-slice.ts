import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReportType, UserData } from "../type/UserDataType";
import { CommentType } from "type/DataType";

const initialState: ReportType = {
  content_type: "",
  content_id: "",
  content_title: "",
  createdAt: "",
  text: "",
  report_reason: "",
  reported_id: "",
  reported_name: "",
  reporter_id: "",
  reporter_name: "",
  report_time: "",
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {},
});

export const reportActions = reportSlice.actions;
export const reportReducer = reportSlice.reducer;
