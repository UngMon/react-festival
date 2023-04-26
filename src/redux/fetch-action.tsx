import { createAsyncThunk } from "@reduxjs/toolkit";
import { Respon } from "../type/Type";

export const getFestiavalData = createAsyncThunk(
  "festival/fetchFromData",
  async () => {
    const serviceKey = process.env.REACT_APP_SERVICE_KEY!;
    const key = encodeURIComponent(serviceKey);
    const response = await fetch(
      `https://apis.data.go.kr/B551011/KorService1/searchFestival1?serviceKey=${key}&numOfRows=1500&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&eventStartDate=20210101`
    );

    const data: Respon = await response.json();
    console.log('fetchFromData');
    return data;
  }
);


