import { useSearchParams } from "react-router-dom";
import { nowDate } from "../../utils/NowDate";

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
  url: string;
}

const typeObject: { [key: string]: string } = {
  tour: "12",
  culture: "14",
  festival: "15",
  travel: "25",
};

const useAllParams = (title: string) => {
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

  let url: string = "";
  let object: { [key: string]: string } = {};
  let deleteArray: string[] = [];

  for (let [key, value] of params) {
    if (!paramObject[key]) {
      deleteArray.push(key);
      continue;
    }
    object[key] = value;
  }

  if (deleteArray.length !== 0) {
    for (let param of deleteArray) {
      params.delete(param);
    }
    url = `?${params.toString()}`;
  }

  for (const key in paramObject) {
    if (!object[key]) {
      object[key] = "";
      if (title !== "festival" && key === "month") continue;
      if (title !== "result" && key === "keyword") continue;
      if (url.length === 0) url = "locallhost:3000";
    }
  }
  console.log(url)
  return { ...object, url } as AllParams;
};

export default useAllParams;
