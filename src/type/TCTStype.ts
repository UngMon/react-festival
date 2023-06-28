import { Region, Item } from "./Common";

export interface TCTRtype {
  successGetData: boolean;
  tour: Region;
  culture: Region;
  travel: Region;
  result: Region;
  loading: boolean;
  // tourLoading?: boolean;
  // cultrueLoading?: boolean;
  // travelLoading?: boolean;
  serchRecord: [string, string];
  // serchRecord: { prev: [string, string]; now: [string, string] };
}
