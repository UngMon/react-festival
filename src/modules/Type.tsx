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

export type ContentDetail = {
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

export type ContentImage = {
  contentid: string;
  originimgurl: string;
  smallimageurl: string;
  cpyrhtDivCd: string;
  serialnum: string;
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

export type ResponDetail = {
  response: {
    body: {
      items: {
        item: ContentDetail[];
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
  contentData: ResponDetail;
  contentImage: ResponImage;
}

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
