import { Comment } from "./DataType";

export interface UserData {
  status: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_photo: string;
}

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface PickComment {
  open: string;
  delete: string;
  comment_id: string;
  comment_data: Comment | null;
  revise: Record<string, string>;
  reply: Record<string, string>;
}

export interface ReportType {
  open: string;
  content_type: string;
  content_id: string;
  content_title: string;
  createdAt: string;
  content: string;
  report_reason: Record<string, string>;
  reported_id: string;
  reported_name: string;
  reporter_id: string;
  reporter_name: string;
}
