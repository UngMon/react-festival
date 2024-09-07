import {
  ResponCommon,
  ResponInfo,
  ResponIntro,
  GetContentData,
} from "../type/ContentType";

const getContentData = async (
  id: string,
  type: string
): Promise<GetContentData> => {
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

  const getDataContentInfo = async (category: string): Promise<ResponInfo> => {
    const response = await fetch(makeUrl(category));

    if (!response.ok) throw new Error("Failed to Fetch from Data");
    const data: ResponInfo = await response.json();
    return data;
  };

  const getDataContentIntro = async (
    category: string
  ): Promise<ResponIntro> => {
    const response = await fetch(makeUrl(category));

    if (!response.ok) throw new Error("Failed to Fetch from Data");

    const data: ResponIntro = await response.json();
    return data;
  };

  const getDataContentCommon = async (
    category: string
  ): Promise<ResponCommon> => {
    const response = await fetch(makeUrl(category));

    if (!response.ok) throw new Error("Failed to Fetch from Data");

    const data: ResponCommon = await response.json();
    return data;
  };

  const [contentInfo, contentIntro, contentCommon] = await Promise.all([
    getDataContentInfo("Info"),
    getDataContentIntro("Intro"),
    getDataContentCommon("Common"),
  ]);
  return { contentInfo, contentIntro, contentCommon };
};

export default getContentData;
