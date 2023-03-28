import { createSlice } from "@reduxjs/toolkit";
import { getFriebaseImageData } from "./fetch-action";
import { FirebaseData } from "../modules/Type";

interface firebaseState {
  contentData: FirebaseData;
  isChanged: boolean;
  succesGetData: boolean;
}

const initialState: firebaseState = {
  contentData: {},
  isChanged: false,
  succesGetData: false,
};

const firebaseSlice = createSlice({
  name: "firebase",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFriebaseImageData.pending, (state) => {})
      .addCase(getFriebaseImageData.fulfilled, (state, action) => {
        state.contentData = action.payload;
        state.succesGetData = true;
        console.log(action.payload);
        console.log(state.contentData)
      })
      .addCase(getFriebaseImageData.rejected, (state, action) => {
        state.succesGetData = false;
        console.log(action.error);
      });
  },
});

export const firebaseActions = firebaseSlice.actions;

export const firebaseReducer = firebaseSlice.reducer;
