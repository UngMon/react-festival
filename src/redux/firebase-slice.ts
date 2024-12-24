import { createSlice } from "@reduxjs/toolkit";
import { UserData } from "../type/UserDataType";

const initialState: UserData = {
  loadingState: "pending",
  succesGetContentData: false,
  loginedUser: false,
  user_id: "",
  user_name: "",
  user_email: "",
  user_photo: "",
};

const firebaseSlice = createSlice({
  name: "firebase",
  initialState,
  reducers: {
    login(state, action) {
      const { user_id, user_name, user_email, user_photo } = action.payload;

      state.loadingState = "fulfilled";
      state.succesGetContentData = true;
      state.loginedUser = true;
      state.user_id = user_id;
      state.user_name = user_name;
      state.user_email = user_email;
      state.user_photo = user_photo;
    },
    logout(state) {
      state.loadingState = "fulfilled";
      state.succesGetContentData = true;
      state.loginedUser = false;
      state.user_id = "";
      state.user_name = "";
      state.user_email = "";
      state.user_photo = "";
    },
    userDataNotFound(state) {
      state.loadingState = "fulfilled";
      state.succesGetContentData = false;
    },
  },
});

export const firebaseActions = firebaseSlice.actions;

export const firebaseReducer = firebaseSlice.reducer;
