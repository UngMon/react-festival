export interface Comment {
  content_type: string;
  content_id: string;
  content_title: string;
  content: [string, string, string];
  user_id: string;
  user_name: string;
  user_photo: string;
  createdAt: string;
  origin_id: null | string;
  parent_id: null | string;
  parent_name: null | string;
  like_count: number;
  dislike_count: number;
  reply_count: number;
  isRevised: boolean;
  emotion: Record<string, string>;
}

export interface Feel {
  like: number;
  dislike: number;
  users: Record<string, { reaction: string; time: number }>;
}

export interface UserData {
  loadingState: string;
  succesGetContentData: boolean;
  loginedUser: boolean;
  user_id: string;
  user_name: string;
  user_email: string;
  user_photo: string;
}

export interface PickComment {
  // replyIndex: number | null;
  open: string;
  delete: string;
  comment_id: string;
  comment_data: Comment | null;
  revise: Record<string, string>;
  reply: Record<string, string>;
}

export interface ReportType {
  open: boolean;
  contentType: string;
  contentId: string;
  contentTitle: string;
  createdAt: string;
  content: string;
  reportForReason: string;
  reportedUserUid: string;
  reportedUserName: string;
  reporterUid: string;
  reporterName: string;
}
