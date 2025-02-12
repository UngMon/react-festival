import { Item } from "./FetchType";

export interface DataType {
  successGetData: boolean;
  httpState: string;
  tour: Record<string, Item[]>;
  culture: Record<string, Item[]>;
  festival: Record<string, Item[]>;
  travel: Record<string, Item[]>;
  leports: Record<string, Item[]>;
  search: Record<string, Item[]>;
  loading: boolean;
  record: string[];
  행사상태: [boolean, boolean, boolean];
  contentTitle: string | undefined;
}
