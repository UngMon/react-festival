import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchParams, FetchRespon } from "../type/Common";

export const getFestiavalData = createAsyncThunk(
  "festival/fetchFromData",
  async () => {
    let year = new Date().getFullYear();
    year -= 1;
    const serviceKey = process.env.REACT_APP_SERVICE_KEY!;
    const key = encodeURIComponent(serviceKey);
    const response = await fetch(
      `https://apis.data.go.kr/B551011/KorService1/searchFestival1?serviceKey=${key}&numOfRows=1500&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&eventStartDate=${
        year + "0101"
      }`
    );

    const data: FetchRespon = await response.json();
    return data;
  }
);

export const getTCTRData = createAsyncThunk(
  "tour/fetchFromData",
  async (parameter: FetchParams) => {
    const serviceKey = encodeURIComponent(process.env.REACT_APP_SERVICE_KEY!);
    const type = parameter.type;
    const title = parameter.title;
    const areaCode = parameter.areaCode;
    let keyword = "";

    let url = `https://apis.data.go.kr/B551011/KorService1/${
      title !== "search" ? "areaBasedList1" : "searchKeyword1"
    }?serviceKey=${serviceKey}&numOfRows=50&pageNo=1&MobileOS=ETC&MobileApp=Moa&_type=json&listYN=Y&arrange=Q`;

    // 네비게이션 이동
    if (title !== "search") {
      url += `&contentTypeId=${type}${
        areaCode ? `&areaCode=${parameter.areaCode}` : ``
      }`;
      keyword = parameter.keyword!;
    }

    // 검색을 한 경우
    if (title === "search")
      //type === 0인 경우는 전체 키워드 검색
      url += `&keyword=${encodeURIComponent(parameter.keyword!)}${
        type !== "0" ? `&contentTypeId=${type}` : ""
      }`;

    const response = await fetch(url);

    const data: FetchRespon = await response.json();

    return { data, areaCode, type, title, keyword };
  }
);
