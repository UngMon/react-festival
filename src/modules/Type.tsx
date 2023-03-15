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
  }
  
export type Respon = {
    response: {
      body: {
        items: {
          item: Item[];
        };
      };
    };
  };

export type Month = {
  [key: string]: Item[];
}

export type Region = {
  [key: string]: Item[];
}

export type Season = {
  [key: string]: Item[];
}