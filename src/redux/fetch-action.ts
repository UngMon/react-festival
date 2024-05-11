import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchParams, FetchRespon } from "../type/Common";

const serviceKey = encodeURIComponent(process.env.REACT_APP_DATA_SERVICE_KEY!);

export const getTourApiData = createAsyncThunk(
  "tour/fetchFromData",
  async (parameter: FetchParams) => {
    const { type, title, areaCode, cat1, cat2, cat3, page } = parameter;
    
    let keyword = "";

    let url: string = "https://apis.data.go.kr/B551011/KorService1/";
    if (title === "festival") {
      url += `searchFestival1?serviceKey=${serviceKey}&numOfRows=2000&pageNo=${page}&MobileOS=ETC&MobileApp=Moa&_type=json&listYN=Y&arrange=Q`;
      const year: number = new Date().getFullYear() - 1;
      url += `&eventStartDate=${year + "0101"}`;
    } else if (title === "result") {
      url += `searchKeyword1?serviceKey=${serviceKey}&numOfRows=50&pageNo=${page}&MobileOS=ETC&MobileApp=Moa&_type=json&listYN=Y&arrange=Q&keyword=${encodeURIComponent(
        parameter.keyword!
      )}${type !== "0" ? `&contentTypeId=${type}` : ""}`;
      // type === 0는 전체 키워드 검색
      keyword = parameter.keyword!;
    } else {
      url += `areaBasedList1?serviceKey=${serviceKey}&numOfRows=50&pageNo=${page}&MobileOS=ETC&MobileApp=Moa&_type=json&listYN=Y&arrange=Q&contentTypeId=${type}`;
      if (areaCode !== '0') url += `&areaCode=${parameter.areaCode}`;
      if (cat1 !== 'all') url += `&cat1=${cat1}`;
      if (cat2 !== "all") url += `&cat2=${cat2}`;
      if (cat3 !== "all") url += `&cat3=${cat3}`;
    }

    const response = await fetch(url);

    const data: FetchRespon = await response.json();

    return { data, areaCode, cat1, cat2, cat3, type, title, keyword };
  }
);
