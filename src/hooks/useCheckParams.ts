import { useSearchParams } from "react-router-dom";

export interface CheckParams {
  contentTypeId?: string;
  month?: string;
  areaCode?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  keyword?: string;
  requireRedirect: string;
}

const useCheckParams = (title: string) => {
  const [params] = useSearchParams();
  let requiredParams: string[] = [];
  let requireRedirect: string = "";

  if (title === "search") {
    requiredParams = ["keyword", "contentTypeId"];
  } else {
    requiredParams = ["contentTypeId", "areaCode", "cat1", "cat2", "cat3"];
    if (title === "festival")
      requiredParams = [requiredParams[0], "month", ...requiredParams.slice(1)];
  }

  const missingParam: boolean = requiredParams.some(
    (param) => !params.has(param)
  );

  if (missingParam) return { requireRedirect: "/" };

  // 중복된 쿼리 파라미터 제거하기
  const uniqueParams = new URLSearchParams();
  params.forEach((value, key) => uniqueParams.set(key, value));

  let checkedTheParams: boolean = false;

  // 불필요한 쿼리 파라미터 제거하고 paramsObject에 담기
  let paramsObject: Record<string, string> = {};
  uniqueParams.forEach((value, key) => {
    if (requiredParams.includes(key)) paramsObject[key] = value;
    else checkedTheParams = true;
  });

  let url: string = "?";
  for (const key in paramsObject) {
    if (!paramsObject[key]) return { requireRedirect: "/" };

    if (key === "keyword") {
      url += `&keyword=${encodeURIComponent(paramsObject[key])}`;
      continue;
    }

    if (url.length > 1) url += "&";
    url += `${key}=${paramsObject[key]}`;
  }

  if (checkedTheParams) requireRedirect = url;

  return { ...paramsObject, requireRedirect } as CheckParams;
};

export default useCheckParams;
