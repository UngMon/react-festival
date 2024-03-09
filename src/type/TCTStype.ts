import { Region, Item, Data } from "./Common";

export interface TCTRtype {
  successGetData: boolean;
  tour: Data;
  culture: Data;
  festival: Item[];
  travel: Data;
  result: { [key: string]: { [key: string]: Item[] } };
  loading: boolean;
  dataRecord: {
    [key: string]: {
      [key: string]: {
        [key: string]: { [key: string]: { [key: string]: string } };
      };
    };
  };
  serchRecord: { [key: string]: { [key: string]: string } };
  // serchRecord: [string, string, string];
  행사상태: [boolean, boolean, boolean];
}
