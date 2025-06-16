import { CheckParams } from "../hooks/useCheckParams";

export type TitleType =
  | "tour"
  | "culture"
  | "festival"
  | "travel"
  | "leports"
  | "search"
  | "lodging"
  | "shoping"
  | "restaurant";

export type Item = {
  cat1: string;
  cat2: string;
  cat3: string;
  contentid: string;
  contenttypeid: string;
  eventstartdate?: string;
  eventenddate?: string;
  firstimage: string;
  firstimage2: string;
  areacode: string;
  sigungucode: string;
  title: string;
};

type ResponseBody<T> = {
  response: {
    body: {
      items: {
        item: T;
      };
    };
  };
};

export type FetchRespon = ResponseBody<Item[]>;
export type PageCountRespon = ResponseBody<[{ totalCnt: string }] | "">;

export interface FetchParams {
  existPageInfo: boolean;
  numOfRows: number;
  page?: number;
  title: TitleType;
  params: CheckParams;
}

export interface FetchTourData {
  totalCount: PageCountRespon;
  numOfRows: number;
  page: number;
  data: FetchRespon;
  areaCode?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  contentTypeId?: string;
  title: TitleType;
  keyword?: string;
}

type It = {
  rnum: string;
  code: string;
  name: string;
};

export type Sigun = ResponseBody<It[]>;

