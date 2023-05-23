import { Region } from "./Common";

export interface TCTRtype {
  successGetData: boolean;
  touristArray?: Region;
  cultureArray?: Region;
  travelArray?: Region;
  // region: string;
  // page: string;
  // cat1: string;
  // cat2: string;
  // cat3: string;
  loading: boolean;
  tourLoading?: boolean;
  cultrueLoading?: boolean;
  travelLoading?: boolean;
}

