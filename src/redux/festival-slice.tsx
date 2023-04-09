import { createSlice } from "@reduxjs/toolkit";
import { Item, Region, Season, Month } from "../modules/Type";
import { getFestiavalData } from "./fetch-action";

// 1: 서울특별시, 2: 인천광역시, 3: 대전광역시, 4: 대구광역시, 5: 광주광역시, 6: 부산광역시,
// 7: 울산광역시  8: 세종특별자치시, 31: 경기도, 32:강원도, 33: 충청북도, 34: 충청남도 ,
// 35: 경상북도, 36: 경상남도  ,37: 전라북도 ,38: 전라남도 39: 제주특별자치도

interface FestivalState {
  successGetData: boolean;
  festivalArray: Item[];
  monthArray: Month;
  regionArray: Region;
  seasonArray: Season;
  sortedMonth: boolean;
  sortedRegion: boolean;
  sortedSeason: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: FestivalState = {
  successGetData: false,
  festivalArray: [],
  monthArray: {},
  regionArray: {},
  seasonArray: {},
  sortedMonth: false,
  sortedRegion: false,
  sortedSeason: false,
  loading: true,
  error: null,
};

const festivalSlice = createSlice({
  name: "festival",
  initialState,
  reducers: {
    sortDataByMonth(state) {

      const result: Month = {
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
      for (const item of state.festivalArray) {
        const startMonth = item.eventstartdate.slice(4, 6);
        const endMonth = item.eventenddate.slice(4, 6);
        for (const mon in result) {
          if (startMonth < mon) {
            (endMonth > mon || endMonth === mon) && result[mon].push(item);
            continue;
          }
          if (startMonth === mon) {
            result[mon].push(item);
            continue;
          }
        }
      }
      state.monthArray = result;
      state.sortedMonth = true;
    },

    sortDataByRegion(state) {

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
      for (const item of state.festivalArray) {
        if (item.areacode === "") {
          continue;
        }
        region[`${item.areacode}`].push(item);
      }
      state.regionArray = region;
      state.sortedRegion = true;
    },
    sortDataBySeason(state) {

      const season: Season = {
        spring: [],
        summer: [],
        authumn: [],
        winter: [],
      };
      for (const item of state.festivalArray) {
        const month = item.eventenddate.slice(4, 6);
        if (month < "03" || month === "12") {
          season["winter"].push(item);
        }

        if (month > "02" && month < "06") {
          season["spring"].push(item);
        }

        if (month > "05" && month < "09") {
          season["summer"].push(item);
        }

        if (month > "08" && month < "12") {
          season["authumn"].push(item);
        }
      }
      season["winter"].sort((a, b) =>
        a.eventenddate < b.eventenddate ? 1 : -1
      );
      state.seasonArray = season;
      state.sortedSeason = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFestiavalData.pending, (state) => {})
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
        console.log(action.error);
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export const festivalActions = festivalSlice.actions;

export const festivalReducer = festivalSlice.reducer;
