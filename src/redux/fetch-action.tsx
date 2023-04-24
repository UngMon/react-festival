import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Respon, FirebaseData } from "../modules/Type";

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

export const getFriebaseData = createAsyncThunk(
  "firebase/getFromData",
  async () => {
    const querySnapshot = await getDocs(collection(db, "content"));
    if (querySnapshot.empty) {
      // 만약 어떠한 이유로 아무런 데이터를 얻지 못 할 경우 에러 던져주기.
      throw Error()
    }
    let arr: FirebaseData = {};

    for (let item of querySnapshot.docs) {
      let cotentId = item.id;
      const data = item.data();
      arr[cotentId] = {
        comment: data.comment,
        detailImage: data.detailImage,
        firstImage: data.firstImage,
        expression: data.expression,
      };
    }
    console.log('getfromdata');
    return arr;
  }
);

