import { Item, Month, Region } from "./Common";

export type ContentIntro = {
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
  accomcountculture?: string;
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

export type ContentCommon = {
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

export type ContentInfo = {
  contentid: string;
  contenttypeid: string;
  serialnum: string;
  infoname: string;
  infotext: string;
  fldgubun: string;
};

export type ContentImage = {
  contentid?: string;
  originimgurl: string;
  smallimageurl?: string;
  cpyrhtDivCd?: string;
  serialnum?: string;
};

export type ResponInfo = {
  response: {
    body: {
      items: {
        item: ContentInfo[];
      };
    };
  };
};

export type ResponIntro = {
  response: {
    body: {
      items: {
        item: ContentIntro[];
      };
    };
  };
};

export type ResponCommon = {
  response: {
    body: {
      items: {
        item: ContentCommon[];
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
  contentDetailIntro: ResponIntro;
  contentDetailCommon: ResponCommon;
  contentImage: ResponImage;
};

export interface FestivalState {
  successGetData: boolean;
  sortedFestivalArr: boolean;
  loading: boolean;
  festivalArray: Item[];
  monthArray: Month;
  regionArray: Region;
  행사상태: [boolean, boolean, boolean];
}

export interface GetContentData {
  contentInfo: ResponInfo;
  contentIntro: ResponIntro;
  contentCommon: ResponCommon;
}
