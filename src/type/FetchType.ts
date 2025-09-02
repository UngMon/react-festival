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

interface ApiSuccessResponse<T> {
  response: {
    body: {
      items: {
        item: T;
      };
      numOfRows: number,
      pageNo: number,
      totalCount: number,
    };
  };
};

interface ApiErrorResponse {
  responseTime: string;
  resultCode: string;
  resultMsg: string;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type TourResponse = ApiResponse<Item[] | ''>;
export type PageCountRespon = ApiResponse<[{ totalCnt: string }] | "">;

export interface FetchParams {
  numOfRows: number;
  page?: number;
  title: TitleType;
  params: CheckParams;
}

export interface FetchTourData {
  numOfRows: number;
  page: number;
  responseData: TourResponse;
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

export type Sigun = ApiResponse<It[]>;
