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

export const createUrl = (
  tourDataType: string,
  numOfRows: number,
  params: CheckParams,
) => {
  const { contentTypeId, keyword, areaCode, cat1, cat2, cat3, page } = params;

  const queryParams = new URLSearchParams({
    ...DEFAULT_PARAMS,
    numOfRows: numOfRows.toString(),
    pageNo: page?.toString() || "1",
    arrange: "Q",
  });

  let endpoint: string = "";

  switch (tourDataType) {
    case "festival":
      endpoint = "searchFestival2";
      // 축제는 2년치 데이터를 한 번에 많이 가져오는 로직 유지
      const startDate = `${new Date().getFullYear() - 1}0101`;
      queryParams.set("numOfRows", "3000"); // 축제는 최대 3000개 한번에 불러오기
      queryParams.set("pageNo", "1");
      queryParams.set("eventStartDate", startDate);
      break;
    case "search":
      endpoint = "searchKeyword2";
      if (keyword) queryParams.set("keyword", keyword);
      break;
    default: // 지역기반 검색
      endpoint = "areaBasedList2";
      queryParams.set("contentTypeId", contentTypeId || "");
      if (areaCode && areaCode !== "0") // (지역 시)
        queryParams.set("lDongRegnCd", areaCode);
      /* lclsSystm1 대분류, lclsSystm2 중분류, lclsSystm3 소분류 */
      if (cat1 && cat1 !== "all") queryParams.set("lclsSystm1", cat1);
      if (cat2 && cat2 !== "all") queryParams.set("lclsSystm2", cat2);
      if (cat3 && cat3 !== "all") queryParams.set("lclsSystm3", cat3);
      break;
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
    const { numOfRows, tourDataType, params } = parameter;
    const url: string = createUrl(tourDataType, numOfRows, params);
    const page_key = createPageKey(tourDataType, numOfRows, params);

    try {
      const response = await fetch(url);
      const responseData = (await response.json()) as TourResponse;

      return {
        responseData,
        page_key,
        tourDataType,
      } as FetchTourData;
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);
