import { createSlice } from "@reduxjs/toolkit";
import { getTouristData } from "./fetch-action";
import { Region } from "../type/Common";
import { TCJRState } from "../type/TCJRType";

// 1: 서울특별시, 2: 인천광역시, 3: 대전광역시, 4: 대구광역시, 5: 광주광역시, 6: 부산광역시,
// 7: 울산광역시  8: 세종특별자치시, 31: 경기도, 32:강원도, 33: 충청북도, 34: 충청남도 ,
// 35: 경상북도, 36: 경상남도  ,37: 전라북도 ,38: 전라남도 39: 제주특별자치도

const initialState: TCJRState = {
  successGetData: false,
  touristArray: {},
  region: "서울",
  page: '1',
  cat1: "all",
  cat2: "all",
  cat3: "all",
  loading: true,
};

const tourSlice = createSlice({
  name: "tour",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTouristData.pending, (state) => {
      })
      .addCase(getTouristData.fulfilled, (state, action) => {
        if (action.payload.type !== '12') return;

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
        console.log(action.payload.data);
        for (const item of dummyData) {
          if (item.firstimage === "") continue;
          region[action.payload.parameter.region].push(item);
        }
        state.touristArray![action.payload.parameter.region] =
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

export const tourActions = tourSlice.actions;

export const tourReducer = tourSlice.reducer;
