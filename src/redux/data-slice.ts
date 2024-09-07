import { createSlice } from "@reduxjs/toolkit";
import { getTourApiData } from "./fetch-action";
import { DataType } from "../type/DataType";
import { Item, Data } from "../type/Common";

// 1: 서울특별시, 2: 인천광역시, 3: 대전광역시, 4: 대구광역시, 5: 광주광역시, 6: 부산광역시,
// 7: 울산광역시  8: 세종특별자치시, 31: 경기도, 32:강원도, 33: 충청북도, 34: 충청남도 ,
// 35: 경상북도, 36: 경상남도  ,37: 전라북도 ,38: 전라남도 39: 제주특별자치도

const initialState: DataType = {
  successGetData: false,
  httpState: "nothing",
  "관광지": {},
  "문화시설": {},
  "축제/공연/행사": [],
  "여행코스": {},
  "레포츠": {},
  "검색": {},
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
      .addCase(getTourApiData.pending, (state, action) => {
        state.successGetData = false;
        state.httpState = "pending";
        state.loading = true;
      })
      .addCase(getTourApiData.fulfilled, (state, action) => {
        state.successGetData = true;
        state.httpState = "fulfilled";
        state.loading = false;

        let contentTypeId = action.payload.contentTypeId || "0";
        let areaCode = action.payload.areaCode || "0";
        let cat1 = action.payload.cat1 || "all";
        let cat2 = action.payload.cat2 || "all";
        let cat3 = action.payload.cat3 || "all";
        let keyword = action.payload.keyword;
        let title = action.payload.title;

        let dummyData = action.payload.data.response.body.items.item;
        console.log(dummyData);
        if (!dummyData) {
          // 데이터를 불러왔지만, 아무런 정보가 없을 때 or
          // 사용자가 url를 조작할 때,
          if (title === "검색") {
            state.serchRecord[keyword] = state.serchRecord?.[keyword] || {};
            state.serchRecord[keyword][contentTypeId] = "complete";
          }
          state.loading = false;
          state.successGetData = true;
          return;
        }

        let arr: Item[] = [];
        let fetstivalArray: Item[] = [];
        let typeArray: Data = {};
        let criteria = title === "축제/공연/행사" ? 2000 : 50;
        let dr = state.dataRecord;

        if (title === "검색") {
          state.검색[keyword] = state.검색[keyword] ?? {};
          // state.result[keyword][type] = state.result[keyword][type] ?? [];
          console.log(contentTypeId)
          state.검색[keyword][contentTypeId] = [
            ...(state.검색[keyword][contentTypeId] ?? []),
            ...dummyData,
          ];

          state.serchRecord[keyword] = state.serchRecord[keyword] ?? {};
          state.serchRecord[keyword][contentTypeId] =
            state.serchRecord[keyword][contentTypeId] ?? "remaining";
          state.serchRecord[keyword][contentTypeId] =
            dummyData.length < criteria ? "complete" : "remaining";

          return;
        } else {
          dr[contentTypeId] = dr[contentTypeId] || {};
          dr[contentTypeId][areaCode] = dr[contentTypeId][areaCode] || {};
          dr[contentTypeId][areaCode][cat1] = dr[contentTypeId][areaCode][cat1] || {};
          dr[contentTypeId][areaCode][cat1][cat2] = dr[contentTypeId][areaCode][cat1][cat2] || {};
          dr[contentTypeId][areaCode][cat1][cat2][cat3] =
            dr[contentTypeId][areaCode][cat1][cat2][cat3] || "reaming";

          if (dummyData.length < criteria)
            dr[contentTypeId][areaCode][cat1][cat2][cat3] = "complete";
        }

        if (title === "관광지") typeArray = state.관광지;

        if (title === "문화시설") typeArray = state.문화시설;

        if (title === "여행코스") typeArray = state.여행코스;

        if (title === "레포츠") typeArray = state.레포츠;

        if (title === "축제/공연/행사") {
          for (let item of dummyData) {
            if (item.areacode === "") continue;

            if (item.eventenddate! < `${new Date().getFullYear()}0101`)
              continue;

            fetstivalArray.push(item);
          }

          state['축제/공연/행사'] = fetstivalArray.sort((a, b) =>
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
      .addCase(getTourApiData.rejected, (state, action) => {
        state.loading = false;
        state.successGetData = false;
        state.httpState = "fulfilled";
      });
  },
});

export const dataActions = dataSlice.actions;

export const dataReducer = dataSlice.reducer;
