import { createAsyncThunk } from "@reduxjs/toolkit";
import { Respon } from "../modules/Type";

export const fetchFromData = createAsyncThunk(
  "festival/fetchFromData",
  async () => {
    const serviceKey = process.env.REACT_APP_SERVICE_KEY!;
    const key = encodeURIComponent(serviceKey) 
    const response = await fetch(
      `https://apis.data.go.kr/B551011/KorService1/searchFestival1?serviceKey=${key}&numOfRows=1500&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&eventStartDate=20210101`
    );

    if (!response.ok) {
      throw new Error('데이터를 불러오지 못 했습니다.')
    }
    const data: Respon = await response.json();
    console.log('Thunk complete')
    return data;
  }
);
