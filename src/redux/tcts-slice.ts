import { createSlice } from "@reduxjs/toolkit";
import { getTCTRData } from "./fetch-action";
import { Region } from "../type/Common";
import { TCTRtype } from "../type/TCTStype";
import { Item } from "../type/Common";

// 1: 서울특별시, 2: 인천광역시, 3: 대전광역시, 4: 대구광역시, 5: 광주광역시, 6: 부산광역시,
// 7: 울산광역시  8: 세종특별자치시, 31: 경기도, 32:강원도, 33: 충청북도, 34: 충청남도 ,
// 35: 경상북도, 36: 경상남도  ,37: 전라북도 ,38: 전라남도 39: 제주특별자치도

const initialState: TCTRtype = {
  successGetData: false,
  touristArray: {},
  cultureArray: {},
  travelArray: {},
  searchArray: [],
  loading: false,
  tourLoading: true,
  cultrueLoading: true,
  travelLoading: true,
  serchRecord: ["", "", ""],
};

const tctsSlice = createSlice({
  name: "tcts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTCTRData.pending, (state, action) => {
        state.loading = true;
        if (action.meta.arg.title === "search")
          state.serchRecord = [
            "pending",
            action.meta.arg.type,
            action.meta.arg.keyword!,
          ];
      })
      .addCase(getTCTRData.fulfilled, (state, action) => {
        const dummyData = action.payload.data.response.body.items.item;
        // console.log(dummyData);

        state.successGetData = true;
        state.loading = false;
        console.log('working??????')
        console.log(dummyData)
        if (!dummyData) {
          // 데이터를 불러왔지만, 아무런 정보가 없을 때,
          // ex 사용자가 url를 조작할 때,
          if (action.payload.title === "search")
            state.serchRecord = [
              "fulfiled",
              state.serchRecord[1],
              state.serchRecord[2],
            ];
          return;
        }

        if (action.payload.title === "search") {
          const arr: Item[] = [];
          for (const item of dummyData) {
            if (item.firstimage === "") continue;
            if (!item.areacode) continue;
            arr.push(item);
          }
          state.searchArray = arr;
          state.serchRecord = [
            "fulfiled",
            state.serchRecord[1],
            state.serchRecord[2],
          ];
          return;
        }

        let region: Region = {
          "0": [],
          "1": [],
          "2": [],
          "3": [],
          "4": [],
          "5": [],
          "6": [],
          "7": [],
          "8": [],
          "31": [],
          "32": [],
          "33": [],
          "34": [],
          "35": [],
          "36": [],
          "37": [],
          "38": [],
          "39": [],
        };
        console.log(action.payload.areaCode);
        console.log(action.payload.type);

        for (const item of dummyData) {
          if (item.firstimage === "") continue;
          if (!item.areacode) continue;
          region[action.payload.areaCode].push(item);
        }

        if (action.payload.type === "12") {
          state.touristArray[action.payload.areaCode] =
            region[action.payload.areaCode];
        }

        if (action.payload.type === "14") {
          state.cultureArray[action.payload.areaCode] =
            region[action.payload.areaCode];
        }

        if (action.payload.type === "25") {
          state.travelArray[action.payload.areaCode] =
            region[action.payload.areaCode];
        }
      })
      .addCase(getTCTRData.rejected, (state, action) => {
        state.loading = false;
        state.successGetData = false;
        console.log(action);
      });
  },
});

export const tctsActions = tctsSlice.actions;

export const tctsReducer = tctsSlice.reducer;
