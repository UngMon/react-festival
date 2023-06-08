import { Region, Item } from "./Common";

export interface TCTRtype {
  successGetData: boolean;
  touristArray: Region;
  cultureArray: Region;
  travelArray: Region;
  searchArray: Item[];
  loading: boolean;
  tourLoading?: boolean;
  cultrueLoading?: boolean;
  travelLoading?: boolean;
  serchRecord: [string, string, string];
}
