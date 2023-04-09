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
  userEmail: string;
  userPhoto: string;
}

const initialState: firebaseState = {
  contentData: {},
  isChanged: false,
  succesGetData: false,
  userChecking: true,
  loginedUser: false,
  userUid: "",
  userName: "",
  userEmail: "",
  userPhoto: "",
};

const firebaseSlice = createSlice({
  name: "firebase",
  initialState,
  reducers: {
    notLoginUser(state) {
      state.userChecking = false;
    },
    setUserData(state, action) {
      if (state.loginedUser) {
        return;
      }

      state.userUid = action.payload.uid;
      state.userName = action.payload.displayName;
      state.userEmail = action.payload.email;
      state.userPhoto = action.payload.photoURL;
      state.loginedUser = true;
      state.userChecking = false;
    },
    logOutUser(state) {
      state.userName = "";
      state.userUid = "";
      state.userEmail = "";
      state.userPhoto = "";
      state.loginedUser = false;
    },
    setCardData(state, action) {
      state.contentData[action.payload] = {
        comment: [],
        detailImage: [],
        firstImage: "",
        expression: {},
      };
    },
    updateFeelingData(state, action) {
      console.log(action.payload);
      let dummyData: FirebaseData = { ...state.contentData };
      const userPicked = action.payload.userPicked;
      dummyData[action.payload.contentId].expression[action.payload.uid] = {
        좋아요: userPicked[0],
        그저그래요: userPicked[1],
        싫어요: userPicked[2],
      };
      state.contentData = dummyData;
    },
    updateReviewData(state, action) {
      let dummyData: FirebaseData = { ...state.contentData };
      dummyData[action.payload.contentId].comment = action.payload.array;
      state.contentData = dummyData;
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
