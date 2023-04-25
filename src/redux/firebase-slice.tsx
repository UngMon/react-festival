import { createSlice } from "@reduxjs/toolkit";
import { getFriebaseData } from "./fetch-action";
import { FirebaseData } from "../type/Type";
import { firebaseState } from "../type/Type";

const initialState: firebaseState = {
  contentData: {},
  isChanged: false,
  isLoading: false,
  succesGetData: false,
  userChecking: true,
  loginedUser: false,
  userUid: "",
  userName: "",
  userEmail: "",
  userPhoto: "",
  userSocial: "",
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
      const whatIsSocial = state.userUid.split(":");
      state.userSocial = whatIsSocial.length > 1 ? whatIsSocial[0] : "";
    },
    logOutUser(state) {
      state.userName = "";
      state.userUid = "";
      state.userEmail = "";
      state.userPhoto = "";
      state.loginedUser = false;
      state.userSocial = "";
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
      .addCase(getFriebaseData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFriebaseData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.succesGetData = true;
        state.contentData = action.payload;
      })
      .addCase(getFriebaseData.rejected, (state, action) => {
        state.isLoading = false;
        state.succesGetData = false;
        let errorMessage =
          "데이터를 불러오는데 문제가 발생했습니다. 이러한 현상이 지속된다면 아래 이메일로 문의해주세요!";
        alert(errorMessage);
        console.log(action.error.message);
      });
  },
});

export const firebaseActions = firebaseSlice.actions;

export const firebaseReducer = firebaseSlice.reducer;
