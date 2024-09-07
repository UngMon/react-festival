import { Item, Data } from "./Common";

export interface DataType {
  successGetData: boolean;
  httpState: string;
  "관광지": Data;
  "문화시설": Data;
  "축제/공연/행사": Item[];
  "여행코스": Data;
  "레포츠": Data;
  "검색": { [key: string]: { [key: string]: Item[] } };
  loading: boolean;
  dataRecord: {
    [key: string]: {
      [key: string]: {
        [key: string]: { [key: string]: { [key: string]: string } };
      };
    };
  };
  serchRecord: { [key: string]: { [key: string]: string } };
  행사상태: [boolean, boolean, boolean];
}
