import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchParams, FetchRespon } from "../type/Common";

const serviceKey = encodeURIComponent(process.env.REACT_APP_DATA_SERVICE_KEY!);

export const getFestiavalData = createAsyncThunk(
  "festival/fetchFromData",
  async () => {
    let year = new Date().getFullYear();
    year -= 1;

    const response = await fetch(
      `https://apis.data.go.kr/B551011/KorService1/searchFestival1?serviceKey=${serviceKey}&numOfRows=2000&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&eventStartDate=${
        year + "0101"
      }`
    );

    const data: FetchRespon = await response.json();
    return data;
  }
);

export const getApiData = createAsyncThunk(
  "tour/fetchFromData",
  async (parameter: FetchParams) => {
    const { type, title, areaCode, cat1, cat2, cat3, page } = parameter;
    let keyword = "";

    let url = "https://apis.data.go.kr/B551011/KorService1/";

    if (title === "festival") url += `searchFestival1?`;
    else if (title === "result") url += "searchKeyword1?";
    else url += "areaBasedList1?";

    url += `serviceKey=${serviceKey}&numOfRows=${
      title === "festival" ? "2000" : "50"
    }&pageNo=${page}&MobileOS=ETC&MobileApp=Moa&_type=json&listYN=Y&arrange=Q`;

    // 네브바 클릭
    if (title !== "result" && title !== "festival") {
      url += `&contentTypeId=${type}${
        areaCode !== "0" ? `&areaCode=${parameter.areaCode}` : ``
      }`;

      if (cat2 !== "all") url += `&cat2=${cat2}`;
      if (cat3 !== "all") url += `&cat3=${cat3}`;
    }

    if (title === "festival") {
      let year = new Date().getFullYear();
      year -= 1;
      url += `&eventStartDate=${year + "0101"}`;
    }

    // 검색을 한 경우
    if (title === "result") {
      //type === 0인 경우는 전체 키워드 검색
      url += `&keyword=${encodeURIComponent(parameter.keyword!)}${
        type !== "0" ? `&contentTypeId=${type}` : ""
      }`;
      keyword = parameter.keyword!;
    }

    const response = await fetch(url);

    const data: FetchRespon = await response.json();

    return { data, areaCode, cat1, cat2, cat3, type, title, keyword };
  }
);
