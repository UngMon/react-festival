import { createSlice } from "@reduxjs/toolkit";
import { getTCTRData } from "./fetch-action";
import { Region } from "../type/Common";
import { TCTRtype } from "../type/TCTRtype";

// 1: 서울특별시, 2: 인천광역시, 3: 대전광역시, 4: 대구광역시, 5: 광주광역시, 6: 부산광역시,
// 7: 울산광역시  8: 세종특별자치시, 31: 경기도, 32:강원도, 33: 충청북도, 34: 충청남도 ,
// 35: 경상북도, 36: 경상남도  ,37: 전라북도 ,38: 전라남도 39: 제주특별자치도

//A01: 자연, A02: 인문(문화/예술/역사)
//A0101 : 자연관광지, A0102 관광자원
// A0101 => A01010100 국립공원, A01010200: 도립공원, A01010300: 군립공원.
// A01010400: 산, A01010500: 자연생태관광지, A01010600: 자연휴양림, A01010700: 수목원.
// A01010800: 폭포, A01010900: 계곡, A01011000: 약수터, A01011100: 해안절경, A01011200: 해수욕장,
// A01011300: 섬, A01011400: 항구/포구, A01011600: 등대, A01011700: 호수, A01011800: 강, A01011900: 동굴
// A0102 => A01020100 희귀동 식물, A01020200 기암괴석

// A02 => A0201: 역사관광지, A0202: 휴양관광지, A0203: 체험관광지, A0204:산업관광지, A0205: 건축/조형물
// A0201 => A02010100 고궁, A02010200 성 A02010300 문, A02010400 고택, A02010500: 생가 
// A02010600 생가, A02010600 민속마을, A02010700 유적지/사적지, A02010800 사찰
// A02010900 종교성지, A02011000 안보관광

// A0202 => A02020200 관광단지, A02020300 온천/ 육장 스파 A02020400 이색찜질방, 
// A02020500 헬스투어, A02020600 테마공원 A02020700 공원 A02020800 유람선/잠수함관광

//A203 => A02030100 농.산.어촌 체험, A02030200 전통체험, A02030300 산사체험, A02030600 이색거리


// 204 => A02040400 발전소, A02040600 식음료, A02040800 기타, A02040900 전자/반도체, A02041000 자동차
// 205=> A02050100 다리/대교, A02050200 기념탑/기념비/전망대, A02050300 분수 
// A02050400 동상 A02050500 터널 A02050600 유명건물
const initialState: TCTRtype = {
  successGetData: false,
  touristArray: {},
  loading: true,
};

const tourSlice = createSlice({
  name: "tour",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTCTRData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTCTRData.fulfilled, (state, action) => {
        if (action.payload.type !== '12') {
          state.loading = false;
          return;
        }

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
      .addCase(getTCTRData.rejected, (state, action) => {
        state.loading = false;
        state.successGetData = false;
        console.log(action.error);
      });
  },
});

export const tourActions = tourSlice.actions;

export const tourReducer = tourSlice.reducer;
