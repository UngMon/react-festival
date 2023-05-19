import { Region } from "./Common";

export interface TCJRState {
  successGetData: boolean;
  touristArray?: Region;
  cultureArray?: Region;
  region: string;
  page: string;
  cat1: string;
  cat2: string;
  cat3: string;
  loading: boolean;
}

