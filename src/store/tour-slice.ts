import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTourApi } from "api/fetchTourApi";
import { DataType } from "types/DataType";
import { Item, FetchTourData } from "types/FetchType";

// 1: 서울특별시, 2: 인천광역시, 3: 대전광역시, 4: 대구광역시, 5: 광주광역시, 6: 부산광역시,
// 7: 울산광역시  8: 세종특별자치시, 31: 경기도, 32:강원도, 33: 충청북도, 34: 충청남도 ,
// 35: 경상북도, 36: 경상남도  ,37: 전라북도 ,38: 전라남도 39: 제주특별자치도

const initialState: DataType = {
  datas: {},
  page_record: [],
  httpState: "nothing",
  행사상태: [true, false, false],
};

const tourSlice = createSlice({
  name: "tourApi",
  initialState,
  reducers: {
    행사상태설정(state, action) {
      state.행사상태 = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTourApi.pending, (state) => {
        state.httpState = "pending";
      })
      .addCase(
        fetchTourApi.fulfilled,
        (state, action: PayloadAction<FetchTourData>) => {
          const { responseData, page_key, cat1 } = action.payload;

          if (!("response" in responseData)) {
            // api 요청 에러 발생
            state.httpState = "rejected";
            // state.loading = false;
            console.error(`Error Message: ${responseData.resultMsg}`);
            return;
          }

          let totalCount: number = responseData.response.body.totalCount;

          state.httpState = "fulfilled";

          let tourData = responseData.response.body.items.item;

          if (tourData === "") {
            // API는 성공적으로 응답이 됐지만, 내용이 없는 경우
            state.page_record.push(page_key);
            state.datas[page_key] = {
              tourData: [],
              totalCount: 0,
            };
            return;
          }

          if (cat1 === "EV") {
            let fetstivalArray: Item[] = [];
            const TodayYear = `${new Date().getFullYear()}0101`;

            for (const item of tourData) {
              if (item.lDongRegnCd === "") continue;

              if (item.eventenddate! < TodayYear) continue;

              fetstivalArray.push(item);
            }

            tourData = fetstivalArray.sort((a, b) =>
              a.eventenddate! < b.eventenddate! ? -1 : 1,
            );
          }

          if (!state.datas[page_key])
            state.datas[page_key] = { tourData: [], totalCount: 0 };

          state.datas[page_key] = {
            tourData,
            totalCount,
          };

          if (state.page_record.length > 19) {
            const delete_key = state.page_record.shift();

            if (delete_key && delete_key in state.datas)
              delete state.datas[delete_key];
          }

          state.page_record.push(page_key);
        },
      )
      .addCase(fetchTourApi.rejected, (state) => {
        state.httpState = "rejected";
      });
  },
});

export const tourActions = tourSlice.actions;
export const tourReducer = tourSlice.reducer;
