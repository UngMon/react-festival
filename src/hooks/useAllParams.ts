import { useSearchParams } from "react-router-dom";
import { nowDate } from "../utils/NowDate";

interface Object {
  [key: string]: string;
}

interface AllParams {
  type: string;
  month: string;
  areaCode: string;
  cat1: string;
  cat2: string;
  cat3: string;
  keyword: string;
  requireRedirect: boolean;
}

const typeObject: { [key: string]: string } = {
  tour: "12",
  culture: "14",
  festival: "15",
  travel: "25",
};

const useAllParams = (title: string) => {
  // useAllParams는 사용자가 url를 수정한 경우 올바른 경로로 redirect해준다.
  // type, month, areaCode, cat1, cat2, cat3, keyword를 return

  const [params] = useSearchParams();
  const nowMonth: string = nowDate().month;

  const paramObject: Object = {
    type: typeObject[title],
    month: nowMonth,
    areaCode: "0",
    cat1: title === "festival" || title === "culture" ? "A02" : "all",
    cat2: "all",
    cat3: "all",
    keyword: "",
  };

  let object: Object = {};
  let deleteArray: string[] = [];
  let requireRedirect: boolean = false;

  for (const [key, value] of params) {
    if (paramObject[key]) object[key] = value;
    else deleteArray.push(key);
  }

  // 1, 2번의 조건을 둘다 만족한 경우 아래 반복물을 읽고 지나간다.
  for (const deleteKey of deleteArray) {
    params.delete(deleteKey);
    if (!requireRedirect) requireRedirect = true;
  }

  for (const key in paramObject) {
    if (object[key]) continue;

    object[key] = paramObject[key];
  }

  return { ...object, requireRedirect } as AllParams;
};

export default useAllParams;
