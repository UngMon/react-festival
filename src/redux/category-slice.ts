import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  region: "서울",
  cat1: "all",
  cat2: "all",
  cat3: "all",
};

const category = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearSet(state) {
      state.region = "서울";
      state.cat1 = "all";
      state.cat2 = "all";
      state.cat3 = "all";
    },
    regionChange(state, action) {
      if (action.payload.region === state.region) return;
      state.region = action.payload.region;
    },
    categoryChange(state, action) {
      state.cat1 = action.payload.cat1;
      state.cat2 = action.payload.cat2;
      state.cat3 = action.payload.cat3;
    },
  },
});

export const categoryActions = category.actions;

export const categoryReducer = category.reducer;
