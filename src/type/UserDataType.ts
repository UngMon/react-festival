export interface UserData {
  status: string;
  current_user_id: string;
  current_user_name: string;
  current_user_email: string;
  current_user_photo: string;
}

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface ModalType {
  current_id: string;
  openOption: string;
  openDelete: string;
  openReport: string;
  revise: Record<string, boolean>;
  reply: Record<string, boolean>;
}

export interface ReportType {
  content_type: string;
  content_id: string;
  content_title: string;
  createdAt: string;
  text: string;
  report_reason: string;
  reported_id: string;
  reported_name: string;
  reporter_id: string;
  reporter_name: string;
  report_time: string;
}
