export type Item = {
  addr1: string;
  addr2: string;
  booktour: string;
  cat1: string;
  cat2: string;
  cat3: string;
  contentid: string;
  contenttypeid: string;
  createdtime: string;
  eventstartdate: string;
  eventenddate: string;
  firstimage: string;
  firstimage2: string;
  mapx: string;
  mapy: string;
  mlevel: string;
  modifiedtime: string;
  readcount: string;
  areacode: string;
  sigungucode: string;
  tel: string;
  title: string;
};

export type ContentDetailIntro = {
  contentid: string;
  contenttypeid: string;
  sponsor1: string;
  sponsor1tel: string;
  sponsor2: string;
  sponsor2tel: string;
  eventenddate: string;
  playtime: string;
  eventplace: string;
  eventhomepage: string;
  agelimit: string;
  bookingplace: string;
  placeinfo: string;
  subevent: string;
  program: string;
  eventstartdate: string;
  usetimefestival: string;
  discountinfofestival: string;
  spendtimefestival: string;
  festivalgrade: string;
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

export type Respon = {
  response: {
    body: {
      items: {
        item: Item[];
      };
    };
  };
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

export type Month = {
  [key: string]: Item[];
};

export type Region = {
  [key: string]: Item[];
};

export type Season = {
  [key: string]: Item[];
};

export type Params = {
  contentId: string;
};

export type FirebaseImage = {
  firstImage: string;
  images: [];
};

export type Comment = {
  name: string;
  uid: string;
  when: string;
  text: string;
  userPhoto: string;
};

export type Expression = {
  [key: string]: {
    좋아요: number;
    그저그래요: number;
    싫어요: number;
  };
};

export type ContentData = {
  comment: Comment[];
  detailImage: string[];
  firstImage: string;
  expression: Expression;
};

export type FirebaseData = {
  [key: string]: ContentData;
};


export interface firebaseState {
  contentData: FirebaseData;
  isChanged: boolean;
  isLoading: boolean;
  succesGetData: boolean;
  userChecking: boolean;
  loginedUser: boolean;
  userUid: string;
  userName: string;
  userEmail: string;
  userPhoto: string;
  userSocial: string;
}

export interface FestivalState {
  successGetData: boolean;
  festivalArray: Item[];
  monthArray: Month;
  regionArray: Region;
  seasonArray: Season;
  sortedMonth: boolean;
  sortedRegion: boolean;
  sortedSeason: boolean;
  loading: boolean;
}