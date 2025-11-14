import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "type/UserDataType";
import { User } from "type/UserDataType";

const initialState: UserData = {
  status: "pending",
  current_user_id: "",
  current_user_name: "",
  current_user_email: "",
  current_user_photo: "",
};

const firebaseSlice = createSlice({
  name: "firebase",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User }>) {
      const { uid, displayName, email, photoURL } = action.payload.user;
      state.status = "fulfilled";
      state.current_user_id = uid;
      state.current_user_name = displayName || "";
      state.current_user_email = email || "";
      state.current_user_photo = photoURL || "";
    },
    logout(state) {
      state.status = "pending";
      state.current_user_id = "";
      state.current_user_name = "";
      state.current_user_email = "";
      state.current_user_photo = "";
    },
    userNotFound(state) {
      state.status = "fulfilled";
    },
  },
});

export const firebaseActions = firebaseSlice.actions;

export const firebaseReducer = firebaseSlice.reducer;
