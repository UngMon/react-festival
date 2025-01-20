import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "../type/UserDataType";
import { User } from "../type/UserDataType";

const initialState: UserData = {
  loadingState: "pending",
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
    login(state, action: PayloadAction<{ user: User }>) {
      const { uid, displayName, email, photoURL } = action.payload.user;
      state.loadingState = "fulfilled";
      state.loginedUser = true;
      state.user_id = uid;
      state.user_name = displayName || "";
      state.user_email = email || "";
      state.user_photo = photoURL || "";
    },
    logout(state) {
      state.loadingState = "logout";
      state.loginedUser = false;
      state.user_id = "";
      state.user_name = "";
      state.user_email = "";
      state.user_photo = "";
    },
    userNotFound(state) {
      state.loadingState = "fulfilled";
    },
  },
});

export const firebaseActions = firebaseSlice.actions;

export const firebaseReducer = firebaseSlice.reducer;
