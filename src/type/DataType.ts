import { Item } from "./FetchType";

interface Datas {
  tourData: Item[];
  totalCount: number;
}

export interface DataType {
  successGetData: boolean;
  httpState: string;
  tour: Record<string, Datas>;
  culture: Record<string, Datas>;
  festival: Record<string, Datas>;
  travel: Record<string, Datas>;
  leports: Record<string, Datas>;
  lodging: Record<string, Datas>;
  shoping: Record<string, Datas>;
  restaurant: Record<string, Datas>;
  search: Record<string, Datas>;
  loading: boolean;
  page_record: string[];
  행사상태: [boolean, boolean, boolean];
}

export interface Comment {
  content_type: string;
  content_id: string;
  content_title: string;
  text: [string, string, string];
  user_id: string;
  user_name: string;
  user_photo: string;
  createdAt: string;
  origin_id: null | string;
  parent_id: null | string;
  parent_name: null | string;
  like_count: number;
  reply_count?: number;
  updatedAt: null | string;
  image_url: string;
  like_users: Record<string, boolean>;
}

export interface LikedContent {
  like_content: boolean;
  content_type: string;
  content_id: string;
  content_title: string;
  image_url: string;
  createdAt: string;
  user_id: string;
  like: boolean;
}

export interface LikedComment {
  origin_id: string | null;
  comment_id: string;
  content_title: string;
  content_type: string;
  content_id: string;
  content: [string, string, string];
  user_id: string;
  createdAt: string;
  image_url: string;
}

export interface ContentFeel {
  like_count: number;
}

export interface OriginComment {
  comments: Comment[];
  afterIndex: string;
}

export interface ReplyComment {
  reply_comments: Record<string, Comment[]>;
  last_index: Record<string, string>;
}

export interface Log {
  likedComment: Record<string, LikedComment[]>;
  likedContent: Record<string, LikedContent[]>;
  myComment: Record<string, Comment[]>;
  afterIndex: Record<string, string>;
}

export type FetchLogDataType = (Comment | LikedComment | LikedContent)[];
