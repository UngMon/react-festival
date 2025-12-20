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
  serviceKey: SERVICE_KEY, // URLSearchParams가 자동으로 인코딩할 수 있으므로 주의 (아래 설명 참조)
};

export const createUrl = (
  tourDataType: string,
  numOfRows: number,
  params: CheckParams
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
      // 축제는 1년치 데이터를 한 번에 많이 가져오는 로직 유지
      const startDate = `${new Date().getFullYear() - 1}0101`;
      queryParams.set("numOfRows", "2000"); // 축제는 최대 2000개 한번에 불러오기
      queryParams.set("pageNo", "1");
      queryParams.set("eventStartDate", startDate);
      break;
    case "search":
      endpoint = "searchKeyword2";
      if (keyword) queryParams.set("keyword", keyword);
      if (contentTypeId && contentTypeId !== "0") {
        queryParams.set("contentTypeId", contentTypeId);
      }
      break;
    default: // areaBasedList
      endpoint = "areaBasedList2";
      queryParams.set("contentTypeId", contentTypeId || "");
      if (areaCode && areaCode !== "0") queryParams.set("areaCode", areaCode);
      if (cat1 && cat1 !== "all") queryParams.set("cat1", cat1);
      if (cat2 && cat2 !== "all") queryParams.set("cat2", cat2);
      if (cat3 && cat3 !== "all") queryParams.set("cat3", cat3);
      break;
  }

  // serviceKey를 제외하고 나머지 파라미터만 문자열로 변환
  queryParams.delete("serviceKey");
  const queryString = queryParams.toString();

  // 최종 URL 조합 (ServiceKey는 별도 처리하여 안전성 확보)
  return `${BASE_URL}${endpoint}?serviceKey=${encodeURIComponent(
    SERVICE_KEY
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
  }
);
