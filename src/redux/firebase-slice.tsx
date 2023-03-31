import { createSlice } from "@reduxjs/toolkit";
import { getFriebaseImageData } from "./fetch-action";
import { FirebaseData } from "../modules/Type";

interface firebaseState {
  contentData: FirebaseData;
  isChanged: boolean;
  succesGetData: boolean;
  userChecked: boolean;
  loginedUser: boolean;
  userUid: string,
  userName: string,
}

const initialState: firebaseState = {
  contentData: {},
  isChanged: false,
  succesGetData: false,
  userChecked: false,
  loginedUser: false,
  userUid: '',
  userName: '',
};

const firebaseSlice = createSlice({
  name: "firebase",
  initialState,
  reducers: {
    setUserData(state, action) {
      state.userName = action.payload.displayName;
      state.userUid = action.payload.uid;
      state.loginedUser = true;
    },
    logOutUser(state) {
      state.userName = '';
      state.userUid = '';
      state.loginedUser = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFriebaseImageData.pending, (state) => {})
      .addCase(getFriebaseImageData.fulfilled, (state, action) => {
        state.contentData = action.payload;
        state.succesGetData = true;
      })
      .addCase(getFriebaseImageData.rejected, (state, action) => {
        state.succesGetData = false;
        console.log(action.error);
      });
  },
});

export const firebaseActions = firebaseSlice.actions;

export const firebaseReducer = firebaseSlice.reducer;
