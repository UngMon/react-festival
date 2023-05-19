import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  month: "",
  areaCode: "",
  region: "",
  cat1: "",
  cat2: "",
  cat3: "",
};

const category = createSlice({
  name: "category",
  initialState,
  reducers: {},
});

export const categoryActions = category.actions

export const categoryReducer = category.reducer;
