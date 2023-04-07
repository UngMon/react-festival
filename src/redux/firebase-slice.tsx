import { createSlice } from "@reduxjs/toolkit";
import { getFriebaseData } from "./fetch-action";
import { FirebaseData } from "../modules/Type";

interface firebaseState {
  contentData: FirebaseData;
  isChanged: boolean;
  succesGetData: boolean;
  userChecking: boolean;
  loginedUser: boolean;
  userUid: string;
  userName: string;
}

const initialState: firebaseState = {
  contentData: {},
  isChanged: false,
  succesGetData: false,
  userChecking: true,
  loginedUser: false,
  userUid: "",
  userName: "",
};

const firebaseSlice = createSlice({
  name: "firebase",
  initialState,
  reducers: {
    notLoginUser(state) {
      state.userChecking = false;
    },
    setUserData(state, action) {
      state.userName = action.payload.displayName;
      state.userUid = action.payload.uid;
      state.loginedUser = true;
      state.userChecking = false;
    },
    logOutUser(state) {
      state.userName = "";
      state.userUid = "";
      state.loginedUser = false;
    },
    setCardData(state, action) {
      state.contentData[action.payload] = {
        comment: [],
        detailImage: [],
        firstImage: '',
        expression: {},
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFriebaseData.pending, (state) => {})
      .addCase(getFriebaseData.fulfilled, (state, action) => {
        state.contentData = action.payload;
        state.succesGetData = true;
      })
      .addCase(getFriebaseData.rejected, (state, action) => {
        state.succesGetData = false;
        console.log(action.error);
      });
  },
});

export const firebaseActions = firebaseSlice.actions;

export const firebaseReducer = firebaseSlice.reducer;
