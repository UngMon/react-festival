import { CheckParams } from "hooks/useCheckParams";
import { TitleType } from "type/FetchType";

export const generatePageKey = (
  title: TitleType,
  params: CheckParams,
  numOfRows: number,
  page: number
) => {
  const { contentTypeId, areaCode, cat1, cat2, cat3, keyword } = params;

  if (title === "search") return `${contentTypeId}-${keyword}-${page}`;

  if (title === "festival") return "data";

  return `${contentTypeId}-${areaCode}-${cat1}-${cat2}-${cat3}-${numOfRows}-${page}`;
};
