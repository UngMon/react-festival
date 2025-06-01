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
  festival: [],
  travel: {},
  leports: {},
  search: {},
  lodging: {},
  shoping: {},
  restaurant: {},
  loading: false,
  category_total_count: {},
  category_page_record: [],
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
            totalCount,
            data,
            page,
            contentTypeId,
            areaCode,
            cat1,
            cat2,
            cat3,
            keyword,
          } = action.payload;

          let responseFromTourApi = data.response.body.items.item;
          console.log(action.payload);

          let totalCnt: string | undefined = undefined;

          if (totalCount && totalCount.response.body.items.item) {
            const total: string | undefined =
              totalCount.response.body.items.item[0].totalCnt;
            if (total) totalCnt = total;
          }

          state.successGetData = true;
          state.httpState = "fulfilled";
          state.loading = false;

          let page_key: string = "";
          let category_key = "";

          if (title === "search") {
            page_key = `${contentTypeId}-${keyword}-${page}`;
            category_key = `${contentTypeId}-${keyword}`;
          } else if (title !== "festival") {
            page_key = `${contentTypeId}-${numOfRows}-${page}-${areaCode}-${cat1}-${cat2}-${cat3}`;
            category_key = `${contentTypeId}-${areaCode}-${cat1}-${cat2}-${cat3}`;
          }

          if (!responseFromTourApi) {
            // API는 성공적으로 응답이 됐지만, 내용이 없는 경우
            state.category_page_record.push(page_key);
            if (title !== "festival")
              state[title][page_key] = state[title][page_key] ?? [];
            state.category_total_count[category_key] = 0;
            return;
          }

          const addRecord = (
            page_key: string,
            category_key?: string,
            category_total_count?: string
          ) => {
            if (
              category_total_count &&
              !state.category_total_count[category_key!]
            ) {
              state.category_total_count[category_key!] = +category_total_count;
            }

            if (state.category_page_record.length > 19) {
              const delete_key = state.category_page_record.shift();
              if (
                delete_key &&
                state[title] &&
                delete_key in state[title] &&
                title !== "festival"
              ) {
                delete state[title][delete_key];
              }
            }

            state.category_page_record.push(page_key);
          };

          if (title === "festival") {
            let fetstivalArray: Item[] = [];
            const TodayYear = `${new Date().getFullYear()}0101`;

            for (let item of responseFromTourApi) {
              if (item.areacode === "") continue;

              if (item.eventenddate! < TodayYear) continue;

              fetstivalArray.push(item);
            }

            state.festival = fetstivalArray.sort((a, b) =>
              a.eventenddate! < b.eventenddate! ? -1 : 1
            );
            // addRecord("festival");
            return;
          }

          addRecord(page_key, category_key, totalCnt);
          if (!state[title][page_key]) state[title][page_key] = [];

          state[title][page_key].push(...responseFromTourApi);
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
