import { CheckParams } from "hooks/useCheckParams";

export const createPageKey = (numOfRows: number, params: CheckParams) => {
  const { keyword, areaCode, cat1, cat2, cat3, page } = params;

  if (cat1 === "EV") return "festival";

  let pathArray = [areaCode, cat1, cat2, cat3, page, numOfRows];

  // 검색 페이지 키 생성
  if (keyword) pathArray = [keyword, cat1, page, numOfRows];

  return pathArray.join("-");
};
