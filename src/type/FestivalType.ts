import { Item, Month, Region } from "./Common";

export type ContentDetailIntro = {
  contentid: string;
  contenttypeid: string;
  // tour
  infocenter?: string;
  restdate?: string;
  expguide?: string;
  accomcount?: string;
  usetime?: string;
  parking?: string;
  chkpet?: string;
  // culture
  usefee?: string;
  scale?: string;
  spendtime?: string;
  discountinfo?: string;
  parkingfee?: string;
  infocenterculture?: string;
  usetimeculture?: string;
  restdateculture?: string;
  parkingculture?: string;
  chkpetculture?: string;
  // fetival
  sponsor1?: string;
  sponsor1tel?: string;
  sponsor2?: string;
  sponsor2tel?: string;
  eventenddate?: string;
  playtime?: string;
  eventplace?: string;
  eventhomepage?: string;
  agelimit?: string;
  bookingplace?: string;
  placeinfo?: string;
  subevent?: string;
  program?: string;
  eventstartdate?: string;
  usetimefestival?: string;
  discountinfofestival?: string;
  spendtimefestival?: string;
  festivalgrade?: string;

  //travel
  infocentertourcours?: string;
  distance?: string;
  schedule?: string;
  taketime?: string;
  theme?: string;
};

export type ContentDetailCommon = {
  contentid: string;
  contenttypeid: string;
  title: string;
  createdtime: string;
  modifiedtime: string;
  tel: string;
  telname: string;
  homepage: string;
  booktour: string;
  firstimage: string;
  firstimage2: string;
  cpyrhtDivCd: string;
  addr1: string;
  addr2: string;
  mapx: string;
  mapy: string;
  zipcode: string;
  overview: string;
};

export type ContentImage = {
  contentid: string;
  originimgurl: string;
  smallimageurl: string;
  cpyrhtDivCd: string;
  serialnum: string;
};

export type ImageData = {
  originimgurl: string;
};

export type ResponDetailIntro = {
  response: {
    body: {
      items: {
        item: ContentDetailIntro[];
      };
    };
  };
};

export type ResponDetailCommon = {
  response: {
    body: {
      items: {
        item: ContentDetailCommon[];
      };
    };
  };
};

export type ResponImage = {
  response: {
    body: {
      items: {
        item: ContentImage[];
      };
    };
  };
};

export type LoaderData = {
  contentDetailIntro: ResponDetailIntro;
  contentDetailCommon: ResponDetailCommon;
  contentImage: ResponImage;
};

export type Params = {
  contentId: string;
};

export interface FestivalState {
  successGetData: boolean;
  sortedFestivalArr: boolean;
  loading: boolean;
  festivalArray: Item[];
  monthArray: Month;
  regionArray: Region;
  month: string;
  areaCode: string;
  cat2: string;
  cat3: string;
  행사상태: [boolean, boolean, boolean];
}
