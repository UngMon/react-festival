import { createSlice } from "@reduxjs/toolkit";
import { getTCTRData } from "./fetch-action";
import { TCTRtype } from "../type/TCTStype";
import { Item, Data, Region } from "../type/Common";
import { current } from "@reduxjs/toolkit";

// 1: 서울특별시, 2: 인천광역시, 3: 대전광역시, 4: 대구광역시, 5: 광주광역시, 6: 부산광역시,
// 7: 울산광역시  8: 세종특별자치시, 31: 경기도, 32:강원도, 33: 충청북도, 34: 충청남도 ,
// 35: 경상북도, 36: 경상남도  ,37: 전라북도 ,38: 전라남도 39: 제주특별자치도

const initialState: TCTRtype = {
  successGetData: false,
  tour: {},
  culture: {},
  festival: [],
  travel: {},
  result: {},
  loading: false,
  dataRecord: {},
  serchRecord: ["", "", "remaining"],
  행사상태: [true, false, false],
};

const apiDataSlice = createSlice({
  name: "tourApi",
  initialState,
  reducers: {
    행사상태설정(state, action) {
      state.행사상태 = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTCTRData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getTCTRData.fulfilled, (state, action) => {
        state.successGetData = true;
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
          // 데이터를 불러왔지만, 아무런 정보가 없을 때,
          // ex 사용자가 url를 조작할 때,
          if (title === "result")
            state.serchRecord = [type, keyword, "complete"];
          state.loading = false;
          state.successGetData = true;
          return;
        }

        let mismatch = false;
        let criteria = title === "festival" ? 2000 : 50;

        state.serchRecord = [
          type,
          keyword,
          dummyData.length < criteria ? "complete" : "remaining",
        ];

        if (!state.dataRecord[title]) {
          state.dataRecord[title] =
            dummyData.length < criteria ? "complete" : "remaining";
        } else if (dummyData.length < criteria) {
          state.dataRecord[title] = "complete";
        }

        let arr: Item[] = [];
        let fetstivalArray: Item[] = [];
        let typeArray: Data = {};

        if (title === "tour") typeArray = state.tour;

        if (title === "culture") typeArray = state.culture;

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

        if (title === "travel") typeArray = state.travel;

        if (title === "result") typeArray = state.result;

        typeArray[areaCode] = typeArray[areaCode] || {};
        typeArray[areaCode][cat1] = typeArray[areaCode][cat1] || {};
        typeArray[areaCode][cat1][cat2] = typeArray[areaCode][cat1][cat2] || {};
        arr = typeArray[areaCode]?.[cat1]?.[cat2]?.[cat3] || [];

        mismatch =
          type !== state.serchRecord[0] || keyword !== state.serchRecord[1];

        if (!mismatch)
          typeArray[areaCode][cat1][cat2][cat3] = [...arr, ...dummyData];
        else typeArray[areaCode][cat1][cat2][cat3] = [...dummyData];
      })
      .addCase(getTCTRData.rejected, (state, action) => {
        state.loading = false;
        state.successGetData = false;
      });
  },
});

export const tourActions = apiDataSlice.actions;

export const tourReducer = apiDataSlice.reducer;

// if (action.meta.arg.title === "search")
//   state.serchRecord.now = [
//     action.meta.arg.type,
//     action.meta.arg.keyword!,
//   ];

// if (action.payload.title === "search") {
//   const arr: Item[] = [];
//   for (const item of dummyData) {
//     if (item.firstimage === "") continue;
//     if (!item.areacode) continue;
//     arr.push(item);
//   }
//   state.result = arr;
//   // state.serchRecord = [
//   //   "fulfiled",
//   //   state.serchRecord[1],
//   //   state.serchRecord[2],
//   // ];
//   return;
// }

// let region: Region = {
//   "0": [],
//   "1": [],
//   "2": [],
//   "3": [],
//   "4": [],
//   "5": [],
//   "6": [],
//   "7": [],
//   "8": [],
//   "31": [],
//   "32": [],
//   "33": [],
//   "34": [],
//   "35": [],
//   "36": [],
//   "37": [],
//   "38": [],
//   "39": [],
// };

// for (const item of dummyData) {
//   // if (item.firstimage === "") continue;
//   if (!item.areacode) continue;
//   region[areaCode].push(item);
// }
