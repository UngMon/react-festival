import {
  ResponseCommon,
  ResponseInfo,
  ResponseIntro,
  ResponseContentData,
} from "../type/ContentType";

export const fetchContentData = async (
  id: string,
  type: string
): Promise<ResponseContentData> => {
  const serviceKey = encodeURIComponent(
    process.env.REACT_APP_DATA_SERVICE_KEY!
  );

  const makeUrl = (category: string) => {
    let host = `https://apis.data.go.kr/B551011/KorService1/detail${category}1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${type}&contentTypeId=${id}`;
    const param1 = `&defaultYN=Y&firstImageYN=Y&areacodeYN=N&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y`;
    const param2 = "&numOfRows=10&pageNo=1";

    if (category === "Info") return host + param2;
    else if (category === "Intro") return host + param2;
    else return host + param1 + param2;
  };

  const getDataContentInfo = async (
    category: string
  ): Promise<ResponseInfo> => {
    const response = await fetch(makeUrl(category));

    if (!response.ok) throw new Error("Failed to Fetch from Data");
    const data: ResponseInfo = await response.json();
    return data;
  };

  const getDataContentIntro = async (
    category: string
  ): Promise<ResponseIntro> => {
    const response = await fetch(makeUrl(category));

    if (!response.ok) throw new Error("Failed to Fetch from Data");

    const data: ResponseIntro = await response.json();
    return data;
  };

  const getDataContentCommon = async (
    category: string
  ): Promise<ResponseCommon> => {
    const response = await fetch(makeUrl(category));

    if (!response.ok) throw new Error("Failed to Fetch from Data");

    const data: ResponseCommon = await response.json();
    return data;
  };

  const [contentInfo, contentIntro, contentCommon] = await Promise.all([
    getDataContentInfo("Info"),
    getDataContentIntro("Intro"),
    getDataContentCommon("Common"),
  ]);

  return { contentInfo, contentIntro, contentCommon };
};
