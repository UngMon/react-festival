import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "@/type/UserDataType";
import { User } from "@/type/UserDataType";

const initialState: UserData = {
  status: "pending",
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
      state.status = "fulfilled";
      state.user_id = uid;
      state.user_name = displayName || "";
      state.user_email = email || "";
      state.user_photo = photoURL || "";
    },
    logout(state) {
      state.status = "pending";
      state.user_id = "";
      state.user_name = "";
      state.user_email = "";
      state.user_photo = "";
    },
    userNotFound(state) {
      state.status = "fulfilled";
    },
  },
});

export const firebaseActions = firebaseSlice.actions;

export const firebaseReducer = firebaseSlice.reducer;
