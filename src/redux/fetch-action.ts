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
    const encode = encodeURIComponent(parameter.region);
    const type = parameter.type
    console.log(parameter)
    const response = await fetch(
      `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=${serviceKey}&numOfRows=5000&pageNo=1&MobileOS=ETC&MobileApp=Moat&_type=json&listYN=Y&arrange=Q&keyword=${encode}&contentTypeId=${type}`
    );
    
    const data: FetchRespon = await response.json();
    return { data, parameter, type };
  }
);
