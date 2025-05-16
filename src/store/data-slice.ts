import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTourApiData } from "./fetch-action";
import { DataType } from "@/type/DataType";
import { Item, FetchTourData } from "@/type/FetchType";

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
  cat_page_record: {},
  cat_record: [],
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
      .addCase(getTourApiData.pending, (state, action) => {
        state.successGetData = false;
        state.httpState = "pending";
        state.loading = true;
      })
      .addCase(
        getTourApiData.fulfilled,
        (state, action: PayloadAction<FetchTourData>) => {
          const {
            title,
            numOfRows,
            pageNumber,
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

          let page_count: string | undefined = pageNumber
            ? pageNumber.response.body.items.item === ""
              ? "0"
              : pageNumber.response.body.items.item[0].totalCnt
            : undefined;

          state.successGetData = true;
          state.httpState = "fulfilled";
          state.loading = false;

          let key: string = "";
          // let pageKey = "";

          if (title === "search") {
            key = `${contentTypeId}-${keyword}-${page}`;
            // pageKey = `${contentTypeId}-${keyword}`;
          } else if (title === "festival") {
            key = "data";
          } else {
            key = `${contentTypeId}-${numOfRows}-${page}-${areaCode}-${cat1}-${cat2}-${cat3}`;
            // pageKey = `${contentTypeId}-${areaCode}-${cat1}-${cat2}-${cat3}`;
          }

          if (!responseFromTourApi) {
            // API는 성공적으로 응답이 됐지만, 내용이 없는 경우
            state.cat_record.push(key);
            return;
          }

          const addRecord = (key: string, page_count?: number | string) => {
            if (page_count && !state.cat_page_record[key]) {
              state.cat_page_record[key] = +page_count;
            }
        
            if (state.cat_record.length > 19) {
              const delete_key = state.cat_record.shift();
              if (delete_key && state[title] && delete_key in state[title]) {
                delete state[title][delete_key];
              }
            }
        
            state.cat_record.push(key);
          };

          if (title === "festival") {
            let fetstivalArray: Item[] = [];

            for (let item of responseFromTourApi) {
              if (item.areacode === "") continue;

              if (item.eventenddate! < `${new Date().getFullYear()}0101`)
                continue;

              fetstivalArray.push(item);
            }

            state.festival[key] = fetstivalArray.sort((a, b) =>
              a.eventenddate! < b.eventenddate! ? -1 : 1
            );
            addRecord(key, page_count);
            // addRecord(key, pageKey, page_count)
            return;
          }
          addRecord(key, page_count)
          // addRecord(key, pageKey, page_count);

          if (!state[title][key]) state[title][key] = [];
          
          state[title][key].push(...responseFromTourApi);
        }
      )
      .addCase(getTourApiData.rejected, (state) => {
        state.loading = false;
        state.successGetData = false;
        state.httpState = "fulfilled";
      });
  },
});

export const dataActions = dataSlice.actions;
export const dataReducer = dataSlice.reducer;
