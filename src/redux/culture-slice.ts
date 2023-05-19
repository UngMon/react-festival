import { createSlice } from "@reduxjs/toolkit";
import { getTouristData } from "./fetch-action";
import { Region } from "../type/Common";
import { TCJRState } from "../type/TCJRType";

const initialState: TCJRState = {
  successGetData: false,
  cultureArray: {},
  region: "서울",
  page: "1",
  cat1: "",
  cat2: "",
  cat3: "",
  loading: true,
};

const cultureSlice = createSlice({
  name: "culture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTouristData.pending, (state) => {})
      .addCase(getTouristData.fulfilled, (state, action) => {
        if (action.payload.type !== "14") return;
        console.log("????");
        let region: Region = {
            서울: [],
            인천: [],
            대전: [],
            대구: [],
            광주: [],
            부산: [],
            울산: [],
            세종: [],
            경기: [],
            강원: [],
            충북: [],
            충남: [],
            경북: [],
            경남: [],
            전북: [],
            전남: [],
            제주: [],
          };
          const dummyData = action.payload.data.response.body.items.item;
   
          for (const item of dummyData) {
            if (item.firstimage === "") continue;
            region[action.payload.parameter.region].push(item);
          }
          state.cultureArray![action.payload.parameter.region] =
            region[action.payload.parameter.region];
          state.successGetData = true;
          state.loading = false;
      })
      .addCase(getTouristData.rejected, (state, action) => {
        state.loading = false;
        state.successGetData = false;
        console.log(action.error);
      });
  },
});

export const cultureActions = cultureSlice.actions;

export const cultureReducer = cultureSlice.reducer;
