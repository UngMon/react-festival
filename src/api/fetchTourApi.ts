import { FetchParams, FetchTourData, TourResponse } from "types/FetchType";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createPageKey } from "utils/createPageKey";
import { CheckParams } from "hooks/useCheckParams";

const SERVICE_KEY = process.env.REACT_APP_DATA_SERVICE_KEY!;
const BASE_URL = "https://apis.data.go.kr/B551011/KorService2/";

// 공통 파라미터 정의
const DEFAULT_PARAMS = {
  MobileOS: "ETC",
  MobileApp: "igotjeogot",
  _type: "json",
};

export const createUrl = (numOfRows: number, params: CheckParams) => {
  const { keyword, areaCode, cat1, cat2, cat3, page } = params;

  const queryParams = new URLSearchParams({
    ...DEFAULT_PARAMS,
    numOfRows: numOfRows.toString(),
    pageNo: page?.toString() || "1",
    arrange: "Q",
  });

  let endpoint: string = "";

  if (cat1 === "EV") {
    // 축제 데이터 불러오기 url
    endpoint = "searchFestival2";
    const startDate = `${new Date().getFullYear() - 1}0101`;
    queryParams.set("numOfRows", "3000"); // 축제는 최대 3000개 한번에 불러오기
    queryParams.set("pageNo", "1");
    queryParams.set("eventStartDate", startDate);
  } else if (keyword) {
    // 키워드 검색 데이터 불러오기 url
    endpoint = "searchKeyword2";
    queryParams.set("keyword", keyword);
    queryParams.set("numOfRows", String(numOfRows));
    if (cat1 && cat1 !== "all") queryParams.set("lclsSystm1", cat1);
    queryParams.set("pageNo", "1");
  } else {
    // 나머지 관광 데이터 불러오기 url
    endpoint = "areaBasedList2";
    if (areaCode && areaCode !== "0")
      // (지역 시)
      queryParams.set("lDongRegnCd", areaCode);
    /* lclsSystm1 대분류, lclsSystm2 중분류, lclsSystm3 소분류 */
    if (cat1 && cat1 !== "all") queryParams.set("lclsSystm1", cat1);
    if (cat2 && cat2 !== "all") queryParams.set("lclsSystm2", cat2);
    if (cat3 && cat3 !== "all") queryParams.set("lclsSystm3", cat3);
  }

  const queryString = queryParams.toString();

  // 최종 URL 조합
  return `${BASE_URL}${endpoint}?serviceKey=${encodeURIComponent(
    SERVICE_KEY,
  )}&${queryString}`;
};

export const fetchTourApi = createAsyncThunk(
  "tour/fetchFromData",
  async (parameter: FetchParams, { rejectWithValue }) => {
    const { numOfRows, params } = parameter;
    const url: string = createUrl(numOfRows, params);
    const page_key = createPageKey(numOfRows, params);

    try {
      const response = await fetch(url);
      const responseData = (await response.json()) as TourResponse;

      return {
        responseData,
        page_key,
        cat1: params.cat1,
      } as FetchTourData;
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);
