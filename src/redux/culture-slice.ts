import { createSlice } from "@reduxjs/toolkit";
import { getTCTRData } from "./fetch-action";
import { Region } from "../type/Common";
import { TCTRtype } from "../type/TCTRtype";

const initialState: TCTRtype = {
  successGetData: false,
  cultureArray: {},
  loading: true,
};

const cultureSlice = createSlice({
  name: "culture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTCTRData.pending, (state) => {})
      .addCase(getTCTRData.fulfilled, (state, action) => {
        return;
        // console.log(action.payload.data)
        // let region: Region = {
        //     서울: [],
        //     인천: [],
        //     대전: [],
        //     대구: [],
        //     광주: [],
        //     부산: [],
        //     울산: [],
        //     세종: [],
        //     경기: [],
        //     강원: [],
        //     충북: [],
        //     충남: [],
        //     경북: [],
        //     경남: [],
        //     전북: [],
        //     전남: [],
        //     제주: [],
        //   };
        //   const dummyData = action.payload.data.response.body.items.item;
   
        //   for (const item of dummyData) {
        //     if (item.firstimage === "") continue;
        //     region[action.payload.parameter.areaCode].push(item);
        //   }
        //   state.cultureArray![action.payload.parameter.areaCode] =
        //     region[action.payload.parameter.areaCode];
        //   state.successGetData = true;
        //   state.loading = false;
      })
      .addCase(getTCTRData.rejected, (state, action) => {
        state.loading = false;
        state.successGetData = false;
        console.log(action.error);
      });
  },
});

export const cultureActions = cultureSlice.actions;

export const cultureReducer = cultureSlice.reducer;
