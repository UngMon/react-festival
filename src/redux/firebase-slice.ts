import { createSlice } from "@reduxjs/toolkit";
import { UserData } from "../type/UserDataType";

const initialState: UserData = {
  isChanged: false,
  loadingState: "pending",
  succesGetContentData: false,
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
    login(state, action) {
      state.loadingState = "fulfilled";
      state.userUid = action.payload.userUid;
      state.userName = action.payload.userName;
      state.userEmail = action.payload.userEmail;
      state.userPhoto = action.payload.userPhoto;
      state.succesGetContentData = true;
      state.loginedUser = true;
    },
    logout(state) {
      state.userUid = "";
      state.userName = "";
      state.userEmail = "";
      state.userPhoto = "";
      state.loginedUser = false;
    },
    nonExistUserData(state) {
      state.loadingState = "fulfilled";
    },
  },
});

export const firebaseActions = firebaseSlice.actions;

export const firebaseReducer = firebaseSlice.reducer;
