import { CheckParams } from "hooks/useCheckParams";

export const createPageKey = (
  tourDataType: string,
  numOfRows: number,
  params: CheckParams
) => {
  const { contentTypeId, keyword, areaCode, cat1, cat2, cat3, page } = params;

  // 배열을 사용하여 키 생성 (가독성 향상)
  if (tourDataType === "search")
    return [contentTypeId, keyword, page].join("-");

  if (tourDataType === "festival") return "data";

  return [contentTypeId, areaCode, cat1, cat2, cat3, numOfRows, page].join("-");
};