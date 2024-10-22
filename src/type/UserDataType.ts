export interface Comment {
  contentType: string;
  contentId: string;
  contentTitle: string;
  content: string;
  uid: string;
  name: string;
  userPhoto: string;
  createdAt: string;
  originUid: null | string;
  parentUid: null | string;
  parentName: null | string;
  like_count: number;
  disLike_count: number;
  reply_count: number;
  isRevised: boolean;
  deepth: number;
  replies?: Comment[];
}

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

export interface PickComment {
  open: string;
  [key: string]: string;
}
