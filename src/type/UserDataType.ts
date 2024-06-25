import { FieldValue } from "firebase/firestore";

export type Comment = {
  name: string;
  uid: string;
  when: string;
  text: string;
  userPhoto: string;
  createdAt: FieldValue;
};

export interface Feel {
  [key: string]: string | number;
}

export interface Count {
  like: number;
  dislike: number;
}

export interface UserData {
  isChanged: boolean;
  loadingState: string;
  succesGetContentData: boolean;
  userChecking: boolean;
  loginedUser: boolean;
  userUid: string;
  userName: string;
  userEmail: string;
  userPhoto: string;
  userSocial: string;
}

export interface Report {
  open: boolean;
  when: string;
  userUid: string;
  name: string;
  text: string;
}
