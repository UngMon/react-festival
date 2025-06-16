import { Item } from "./FetchType";

export interface DataType {
  successGetData: boolean;
  httpState: string;
  tour: Record<string, Item[]>;
  culture: Record<string, Item[]>;
  festival: Item[];
  travel: Record<string, Item[]>;
  leports: Record<string, Item[]>;
  lodging: Record<string, Item[]>;
  shoping: Record<string, Item[]>;
  restaurant: Record<string, Item[]>;
  search: Record<string, Item[]>;
  loading: boolean;
  category_total_count: Record<string, number>;
  category_page_record: string[];
  행사상태: [boolean, boolean, boolean];
}

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
  reply_count?: number;
  isRevised: boolean;
  image_url: string;
  like_users: string[];
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