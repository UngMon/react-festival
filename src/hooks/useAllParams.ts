import { useSearchParams } from "react-router-dom";
import { nowDate } from "../utils/NowDate";

interface AllParams {
  contentTypeId: string;
  month: string;
  areaCode: string;
  cat1: string;
  cat2: string;
  cat3: string;
  keyword: string;
  requireRedirect: string;
}

const catOneObject: { [key: string]: string } = {
  관광지: "all",
  문화시설: "A02",
  "축제/공연/행사": "A02",
  여행코스: "all",
};

const useAllParams = (title: string) => {
  const [params] = useSearchParams();
  const nowMonth: string = nowDate().month;

  const paramObject: Record<string, string> = {
    contentTypeId: params.get("contentTypeId") ?? "0",
    month: params.get("month") ?? nowMonth,
    areaCode: params.get("areaCode") ?? "0",
    cat1: params.get("cat1") ?? catOneObject[title],
    cat2: params.get("cat2") ?? "all",
    cat3: params.get("cat3") ?? "all",
    keyword: params.get("keyword") ?? "",
  };

  let deleteArray: string[] = [];
  let requireRedirect: string = "";

  // (1) 주어진 url에 필요한 parameter가 없는 경우 navigate('/') 로
  if (title === "검색" && !params.get("keyword")) requireRedirect = "/";

  if (title !== "검색") {
    for (const key in paramObject) {
      if (key === "keyword") continue;
      if (title !== "축제/공연/행사" && key === "month") continue;
      if (!params.get(key)) {
        console.log(key)
        requireRedirect = "/";
      }
    }
  }

  // (2) 주어진 url에 불필요한 parameter가 있는 경우 navigate('알맞은 url로')
  if (requireRedirect === "") {
    for (const [key, _] of params) {
      if (!paramObject[key]) deleteArray.push(key);
    }

    for (const key of deleteArray) {
      params.delete(key);
    }
  }
  console.log(requireRedirect)
  console.log(paramObject)
  return { ...paramObject, requireRedirect } as AllParams;
};

export default useAllParams;
