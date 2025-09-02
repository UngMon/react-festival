import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTourApi } from "api/fetchTourApi";
import { DataType } from "type/DataType";
import { Item, FetchTourData } from "type/FetchType";

// 1: 서울특별시, 2: 인천광역시, 3: 대전광역시, 4: 대구광역시, 5: 광주광역시, 6: 부산광역시,
// 7: 울산광역시  8: 세종특별자치시, 31: 경기도, 32:강원도, 33: 충청북도, 34: 충청남도 ,
// 35: 경상북도, 36: 경상남도  ,37: 전라북도 ,38: 전라남도 39: 제주특별자치도

const initialState: DataType = {
  successGetData: false,
  httpState: "nothing",
  tour: {},
  culture: {},
  festival: {},
  travel: {},
  leports: {},
  search: {},
  lodging: {},
  shoping: {},
  restaurant: {},
  loading: false,
  page_record: [],
  행사상태: [true, false, false],
};

const dataSlice = createSlice({
  name: "tourApi",
  initialState,
  reducers: {
    행사상태설정(state, action) {
      state.행사상태 = action.payload;
    },
    changeHttpState(state) {
      state.successGetData = !state.successGetData;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTourApi.pending, (state, action) => {
        state.successGetData = false;
        state.httpState = "pending";
        state.loading = true;
      })
      .addCase(
        fetchTourApi.fulfilled,
        (state, action: PayloadAction<FetchTourData>) => {
          const {
            title,
            numOfRows,
            responseData,
            page,
            contentTypeId,
            areaCode,
            cat1,
            cat2,
            cat3,
            keyword,
          } = action.payload;

          if (!("response" in responseData)) {
            // api 요청 에러 발생
            state.successGetData = false;
            state.httpState = "fulfilled";
            state.loading = false;
            return console.error(`Error Message: ${responseData.resultMsg}`);
          }

          let page_key: string = "";
          let totalCount: number = responseData.response.body.totalCount;

          state.successGetData = true;
          state.httpState = "fulfilled";
          state.loading = false;

          if (title === "search") {
            page_key = `${contentTypeId}-${keyword}-${page}`;
          } else if (title === "festival") {
            page_key = "data";
          } else {
            page_key = `${contentTypeId}-${areaCode}-${cat1}-${cat2}-${cat3}-${numOfRows}-${page}`;
          }

          let tourData = responseData.response.body.items.item;

          if (tourData === "") {
            // API는 성공적으로 응답이 됐지만, 내용이 없는 경우
            state.page_record.push(page_key);
            state[title][page_key] = {
              tourData: [],
              totalCount: 0,
            };
            return;
          }

          if (title === "festival") {
            let fetstivalArray: Item[] = [];
            const TodayYear = `${new Date().getFullYear()}0101`;

            for (const item of tourData) {
              if (item.areacode === "") continue;

              if (item.eventenddate! < TodayYear) continue;

              fetstivalArray.push(item);
            }

            tourData = fetstivalArray.sort((a, b) =>
              a.eventenddate! < b.eventenddate! ? -1 : 1
            );
          }

          state[title][page_key] = {
            tourData,
            totalCount,
          };

          if (state.page_record.length > 19) {
            const delete_key = state.page_record.shift();

            if (delete_key && delete_key in state[title])
              delete state[title][delete_key];
          }

          state.page_record.push(page_key);
        }
      )
      .addCase(fetchTourApi.rejected, (state) => {
        state.loading = false;
        state.successGetData = false;
        state.httpState = "fulfilled";
      });
  },
});

export const dataActions = dataSlice.actions;
export const dataReducer = dataSlice.reducer;
