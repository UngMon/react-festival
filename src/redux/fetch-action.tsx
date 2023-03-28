import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { Respon, FirebaseData } from "../modules/Type";

export const getFestiavalData = createAsyncThunk(
  "festival/fetchFromData",
  async () => {
    const serviceKey = process.env.REACT_APP_SERVICE_KEY!;
    const key = encodeURIComponent(serviceKey);
    const response = await fetch(
      `https://apis.data.go.kr/B551011/KorService1/searchFestival1?serviceKey=${key}&numOfRows=1500&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&eventStartDate=20210101`
    );

    if (!response.ok) {
      throw new Error("데이터를 불러오지 못 했습니다.");
    }
    const data: Respon = await response.json();
    console.log("Thunk complete");
    return data;
  }
);

export const getFriebaseImageData = createAsyncThunk(
  "firebase/getImageFromData",
  async () => {
    const querySnapshot = await getDocs(collection(db, "content"));

    if (querySnapshot === undefined) {
      throw new Error("failed to get Image from friebase");
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
      }
    }

    sessionStorage.setItem('firebaseData', JSON.stringify(arr));
    console.log("firebase get data completed");
    return arr;
  }
);
