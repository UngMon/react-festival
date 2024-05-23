import { ContentData } from "./UserData";

export type FirebaseImage = {
  firstImage: string;
  images: [];
};

export type FirebaseData = {
  [key: string]: ContentData;
};

export interface FirebaseState {
  contentData: FirebaseData;
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
