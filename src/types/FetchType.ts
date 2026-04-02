import { CheckParams } from "../hooks/useCheckParams";

export type TourDataType = string;
// | "experience"
// | "history"
// | "nature"
// | "culture"
// | "festival"
// | "sports"
// | "lodging"
// | "shopping"
// | "restaurant"
// | 'search'

export type Item = {
  // 주소 정보
  addr1: string;
  addr2: string;
  mapx: string;
  mapy: string;
  mlevel: string;
  tel: string;
  zipcode: string;

  // 기본 정보
  contentid: string;
  contenttypeid: string;
  cpyrhtDivCd: string;
  createdtime: string;
  title: string;

  // 대표 이미지 정보
  firstimage: string;
  firstimage2: string;

  // 수정 날짜
  modifiedtime: string;

  // 분류 코드 (지역, 유형)
  lDongRegnCd: string;
  lDongSignguCd: string;
  lclsSystm1: string;
  lclsSystm2: string;
  lclsSystm3: string;

  // 축제 공연 행사 전용 정보
  eventstartdate?: string;
  eventenddate?: string;
  progresstype?: string;
  festivaltype?: string;
};

interface ApiSuccessResponse<T> {
  response: {
    body: {
      items: {
        item: T;
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

interface ApiErrorResponse {
  responseTime: string;
  resultCode: string;
  resultMsg: string;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type TourResponse = ApiResponse<Item[] | "">;
export type PageCountRespon = ApiResponse<[{ totalCnt: string }] | "">;

export interface FetchParams {
  numOfRows: number;
  page?: number;
  params: CheckParams;
}

export interface FetchTourData {
  responseData: TourResponse;
  page_key: string;
  cat1: string;
}

type It = {
  rnum: string;
  code: string;
  name: string;
};

export type Sigun = ApiResponse<It[]>;
