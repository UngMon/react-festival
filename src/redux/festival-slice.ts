import { createSlice } from "@reduxjs/toolkit";
import { Item, Region, Month } from "../type/Type";
import { getFestiavalData } from "./fetch-action";
import { FestivalState } from "../type/Type";

// 1: 서울특별시, 2: 인천광역시, 3: 대전광역시, 4: 대구광역시, 5: 광주광역시, 6: 부산광역시,
// 7: 울산광역시  8: 세종특별자치시, 31: 경기도, 32:강원도, 33: 충청북도, 34: 충청남도 ,
// 35: 경상북도, 36: 경상남도  ,37: 전라북도 ,38: 전라남도 39: 제주특별자치도
// cat2 =>  A207 축제 , A208 공연/행사
// A207 => cat3 => A02070100: 문화관광축제,  A02070200: 일반 축제
// A208 => cat3 => A02080100: 전통공연, A02080200: 연극, A02080300: 뮤지컬, A02080400: 오페라
// A02080500: 전시회, A02080600: 박람회, A02080800: 무용, A02080900: 클래식음악회, A02081000: 대중콘서트
// A02081100 영화, A02081200: 스포츠, A02081300: 기타행사

const initialState: FestivalState = {
  successGetData: false,
  festivalArray: [],
  monthArray: {},
  regionArray: {},
  sortedFestivalArr: false,
  cat2: "",
  cat3: "",
  loading: true,
};
// 내가 분류해야할 것 월, 지역, 카테고리
const festivalSlice = createSlice({
  name: "festival",
  initialState,
  reducers: {
    sortFestivalArray(state) {
      const monthly: Month = {
        "01": [],
        "02": [],
        "03": [],
        "04": [],
        "05": [],
        "06": [],
        "07": [],
        "08": [],
        "09": [],
        "10": [],
        "11": [],
        "12": [],
      };

      let region: Region = {
        "0": [...state.festivalArray],
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

      //O(n)
      for (const item of state.festivalArray) {
        const startMonth = item.eventstartdate.slice(4, 6);
        const endMonth = item.eventenddate.slice(4, 6);

        if (item.areacode !== "") {
          //O(1)
          region[`${item.areacode}`].push(item);
        }

        if (startMonth === endMonth) {
          //O(1)
          monthly[startMonth].push(item);
          continue;
        }

        // startMonth < endMonth 인 경우
        //O(1)
        for (let i = Number(startMonth); i <= Number(endMonth); i++) {
          monthly[`${String(i).padStart(2, "0")}`].push(item);
        }
      }
      state.monthArray = monthly;
      state.regionArray = region;
      state.sortedFestivalArr = true;
    },
    cat2Change(state, action) {
      state.cat2 = action.payload.cat2;
    },

    cat3Change(state, action) {
      state.cat3 = action.payload.cat3;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getFestiavalData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFestiavalData.fulfilled, (state, action) => {
        const dummyData = action.payload.response.body.items.item;
        const arr: Item[] = [];

        for (const item of dummyData) {
          if (item.areacode === "") {
            continue;
          }

          if (item.eventenddate < "20230101") {
            continue;
          } else {
            arr.push(item);
          }
        }
        arr.sort((a, b) => (a.eventenddate < b.eventenddate ? -1 : 1));
        state.festivalArray = arr;
        state.successGetData = true;
        state.loading = false;
      })
      .addCase(getFestiavalData.rejected, (state, action) => {
        state.loading = false;
        state.successGetData = false;
        console.log(action.error.message);
      });
  },
});

export const festivalActions = festivalSlice.actions;

export const festivalReducer = festivalSlice.reducer;
