import { createSlice } from "@reduxjs/toolkit";
import { getApiData } from "./fetch-action";
import { DataType } from "../type/DataType";
import { Item, Data } from "../type/Common";

// 1: 서울특별시, 2: 인천광역시, 3: 대전광역시, 4: 대구광역시, 5: 광주광역시, 6: 부산광역시,
// 7: 울산광역시  8: 세종특별자치시, 31: 경기도, 32:강원도, 33: 충청북도, 34: 충청남도 ,
// 35: 경상북도, 36: 경상남도  ,37: 전라북도 ,38: 전라남도 39: 제주특별자치도

const initialState: DataType = {
  successGetData: false,
  httpState: "nothing",
  tour: {},
  culture: {},
  festival: [],
  travel: {},
  result: {},
  loading: false,
  dataRecord: {},
  serchRecord: {},
  행사상태: [true, false, false],
};

const dataSlice = createSlice({
  name: "tourApi",
  initialState,
  reducers: {
    행사상태설정(state, action) {
      state.행사상태 = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApiData.pending, (state, action) => {
        state.successGetData = false;
        state.httpState = "pending";
        state.loading = true;
      })
      .addCase(getApiData.fulfilled, (state, action) => {
        state.successGetData = true;
        state.httpState = "fulfilled";
        state.loading = false;

        let type = action.payload.type || "0";
        let areaCode = action.payload.areaCode || "0";
        let cat1 = action.payload.cat1 || "all";
        let cat2 = action.payload.cat2 || "all";
        let cat3 = action.payload.cat3 || "all";
        let keyword = action.payload.keyword;
        let title = action.payload.title;

        let dummyData = action.payload.data.response.body.items.item;

        if (!dummyData) {
          // 데이터를 불러왔지만, 아무런 정보가 없을 때 or
          // 사용자가 url를 조작할 때,
          if (title === "result") {
            state.serchRecord[keyword] = state.serchRecord?.[keyword] || {};
            state.serchRecord[keyword][type] = "complete";
          }
          state.loading = false;
          state.successGetData = true;
          return;
        }

        let arr: Item[] = [];
        let fetstivalArray: Item[] = [];
        let typeArray: Data = {};
        let criteria = title === "festival" ? 2000 : 50;
        let dr = state.dataRecord;

        if (title === "result") {
          state.result[keyword] = state.result?.[keyword] || {};
          state.result[keyword][type] = state.result?.[keyword]?.[type] || [];
          state.result[keyword][type] = [
            ...state.result[keyword][type],
            ...dummyData,
          ];

          state.serchRecord[keyword] = state.serchRecord?.[keyword] || {};
          state.serchRecord[keyword][type] =
            state.serchRecord?.[keyword]?.[type] || "remaining";
          state.serchRecord[keyword][type] =
            dummyData.length < criteria ? "complete" : "remaining";

          return;
        } else {
          dr[type] = dr[type] || {};
          dr[type][areaCode] = dr[type][areaCode] || {};
          dr[type][areaCode][cat1] = dr[type][areaCode][cat1] || {};
          dr[type][areaCode][cat1][cat2] = dr[type][areaCode][cat1][cat2] || {};
          dr[type][areaCode][cat1][cat2][cat3] =
            dr[type][areaCode][cat1][cat2][cat3] || "reaming";

          if (dummyData.length < criteria)
            dr[type][areaCode][cat1][cat2][cat3] = "complete";
        }

        if (title === "tour") typeArray = state.tour;

        if (title === "culture") typeArray = state.culture;

        if (title === "travel") typeArray = state.travel;

        if (title === "festival") {
          for (let item of dummyData) {
            if (item.areacode === "") continue;

            if (item.eventenddate! < "20230101") continue;

            fetstivalArray.push(item);
          }

          state.festival = fetstivalArray.sort((a, b) =>
            a.eventenddate! < b.eventenddate! ? -1 : 1
          );
          return;
        }

        typeArray[areaCode] = typeArray[areaCode] || {};
        typeArray[areaCode][cat1] = typeArray[areaCode][cat1] || {};
        typeArray[areaCode][cat1][cat2] = typeArray[areaCode][cat1][cat2] || {};
        arr = typeArray[areaCode]?.[cat1]?.[cat2]?.[cat3] || [];
        typeArray[areaCode][cat1][cat2][cat3] = [...arr, ...dummyData];
      })
      .addCase(getApiData.rejected, (state, action) => {
        state.loading = false;
        state.successGetData = false;
        state.httpState = "fulfilled";
      });
  },
});

export const dataActions = dataSlice.actions;

export const dataReducer = dataSlice.reducer;
