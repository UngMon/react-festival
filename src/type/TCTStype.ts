import { Region, Item, Data } from "./Common";



export interface TCTRtype {
  successGetData: boolean;
  tour: Data;
  culture: Data;
  festival: Item[];
  travel: Data;
  result: Data;
  loading: boolean;
  // tourLoading?: boolean;
  // cultrueLoading?: boolean;
  // travelLoading?: boolean;
  dataRecord: { [key: string]: string };
  serchRecord: [string, string, string];
  행사상태: [boolean, boolean, boolean];
  // serchRecord: { prev: [string, string]; now: [string, string] };
}
