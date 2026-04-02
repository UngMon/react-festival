import { Item } from "./FetchType";

export interface SlideItem {
  title: string;
  text: string;
  images: string[];
  sns: string;
  hash: string;
  contentId: string;
  sigun: string;
  contentType: string;
  link: string;
}

interface Datas {
  tourData: Item[];
  totalCount: number;
}

export interface DataType {
  httpState: string;
  datas: Record<string, Datas>
  page_record: string[];
  행사상태: [boolean, boolean, boolean];
}

export interface CommentType {
  content_type: string;
  content_id: string;
  content_title: string;
  text: string;
  user_id: string;
  user_name: string;
  user_photo: string;
  createdAt: string;
  origin_id: null | string;
  parent_id: null | string;
  parent_name: null | string;
  parent_user_id: null | string;
  like_count: number;
  reply_count: number;
  updatedAt: null | string;
  image_url: string;
  like_users: Record<string, boolean>;
}

export interface LikedContent {
  content_id: string;
  content_type: string;
  content_title: string;
  createdAt: string;
  image_url: string;
}

export interface LikedComment {
  content_id: string;
  content_title: string;
  content_type: string;
  comment_id: string;
  createdAt: string;
  origin_id: string | null;
  text: string;
  user_id: string;
  image_url: string;
}

export interface ContentFeel {
  like_count: number;
}

export interface OriginComment {
  comments: CommentType[];
  afterIndex: string;
  record: string;
}

export interface ReplyComment {
  reply_comments: Record<string, CommentType[]>;
  last_index: Record<string, string>;
}

export interface Log {
  likedComment: Record<string, LikedComment[]>;
  likedContent: Record<string, LikedContent[]>;
  myComment: Record<string, CommentType[]>;
  afterIndex: Record<string, string>;
}

export type LogItem = CommentType | LikedComment | LikedContent;
export type GroupedLogs = Record<string, LogItem[]>; // { "오늘": [item1, item2], ... }
