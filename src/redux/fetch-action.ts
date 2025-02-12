import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchParams, FetchRespon, FetchTourData } from "../type/FetchType";

const serviceKey = encodeURIComponent(process.env.REACT_APP_DATA_SERVICE_KEY!);

export const getTourApiData = createAsyncThunk(
  "tour/fetchFromData",
  async (parameter: FetchParams) => {
    const { numOfRows, page, title, params } = parameter;
    const { areaCode, cat1, cat2, cat3, contentTypeId, keyword } = params;

    let url: string = "https://apis.data.go.kr/B551011/KorService1/";
    const baseParameterOne = `&numOfRows=${numOfRows}&pageNo=${page}`;
    const baseParameterTwo =
      "&MobileOS=ETC&MobileApp=Moa&_type=json&listYN=Y&arrange=Q";

    if (title === "festival") {
      const startDate: string = String(new Date().getFullYear() - 1) + "0101";
      url += `searchFestival1?serviceKey=${serviceKey}&numOfRows=2000&pageNo=1` + baseParameterTwo;
      url += `&eventStartDate=${startDate}`;
    } else if (title === "search") {
      // contentTypeId?, numofRows!, page!, keyword!
      const keyword = params.keyword!;
      const contentTypeId = params.contentTypeId;
      url += `searchKeyword1?serviceKey=${serviceKey}`;
      url += baseParameterOne + baseParameterTwo;
      url += `&keyword=${encodeURIComponent(keyword!)}`;
      if (contentTypeId) url += `&contentTypeId=${contentTypeId}`;
    } else {
      // contentTypeId!, numofRows!, page!, areaCode, cat1?, cat2?, cat3?
      url += `areaBasedList1?serviceKey=${serviceKey}&contentTypeId=${contentTypeId}`;
      url += baseParameterOne + baseParameterTwo;
      if (areaCode !== "0") url += `&areaCode=${areaCode}`;
      if (cat1 !== "all") url += `&cat1=${cat1}`;
      if (cat2 !== "all") url += `&cat2=${cat2}`;
      if (cat3 !== "all") url += `&cat3=${cat3}`;
    }
    console.log(url);

    try {
      const response = await fetch(url);
      const data: FetchRespon = await response.json();

      return {
        numOfRows,
        data,
        page,
        areaCode,
        cat1,
        cat2,
        cat3,
        contentTypeId,
        title,
        keyword,
      } as FetchTourData;
    } catch (error: any) {
      return Promise.reject(error.message);
    }
  }
);
