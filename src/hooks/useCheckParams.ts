import { useParams, useSearchParams } from "react-router-dom";

export interface CheckParams {
  month?: string;
  areaCode?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  keyword?: string;
  page?: string;
  requireRedirect: string;
}

// URL path를 cat1 코드로 변환하는 매핑 테이블
const PATH_TO_CAT1: Record<string, string> = {
  experience: "EX",
  history: "HS",
  nature: "NA",
  culture: "VE",
  festival: "EV",
  sports: "LS",
  lodging: "AC",
  shopping: "SH",
  restaurant: "FD",
  search: "SE",
};

// 1. 타이틀에 따라 파라미터 분리 (Config Object)
const PARAM_CONFIG: Record<string, string[]> = {
  SE: ["keyword", "cat1", "page"],
  EV: ["month", "areaCode", "cat1", "cat2", "cat3"],
  default: ["areaCode", "cat1", "cat2", "cat3", "page"],
};

const useCheckParams = () => {
  const [searchParams] = useSearchParams();
  const { category: pathCategory } = useParams<{ category: string }>();
  /*
  그리고 축제 데이터는 조금 관리가 필요해보임 cat2,3을 변경할 때마다 똑같이 불러옴 축제는 한번에 데이터를 불러오기로 했으니 그냥
  page_record와 별개로 관리를 해야 할 것 같다.
  
  */
  // 1. url path 경로 확인하기
  if (!pathCategory || !PATH_TO_CAT1[pathCategory]) {
    console.log("1. url path 경로 확인하기");
    return { requireRedirect: "/" };
  }

  const path_to_cat1: string = PATH_TO_CAT1[pathCategory];

  // 2. path 체크 후, 현재 title에 맞는 필수 키 목록 가져오기 (없으면 default)
  const requiredKeys = PARAM_CONFIG[path_to_cat1] || PARAM_CONFIG["default"];

  // 3. 검증 및 정제 (단 한 번의 순회로 처리)
  const cleanData: Record<string, string> = {};

  // 필수 파라미터가 모두 있는지 확인 .every()를 사용하여 하나라도 만족하지 않으면 즉시 false 반환
  const hasAllRequired = requiredKeys.every((key) => {
    const value = searchParams.get(key);
    // 값이 없거나 공백만 있는 경우 실패 처리
    if (!value || !value.trim()) return false;

    cleanData[key] = value.trim();
    return true;
  });

  // 4. 필수 파라미터 누락 시 -> 홈으로 리다이렉트
  if (!hasAllRequired) {
    console.log("4. 필수 파라미터 누락 시");
    return { requireRedirect: "/" };
  }

  // 5. 불필요한 파라미터 확인 (길이 비교)
  const currentParamCount = Array.from(searchParams.keys()).length;
  const isDirty = currentParamCount !== requiredKeys.length;

  let redirectUrl = "";

  if (isDirty) {
    console.log("불필요한 파라미터가 있을 때만");
    // 불필요한 파라미터가 있을 때만 정제된 URL 파라미터 문자열 생성
    const cleanSearchParams = new URLSearchParams(cleanData);
    redirectUrl = `?${cleanSearchParams.toString()}`;
    console.log(cleanData, redirectUrl);
  }

  // 6. 경로와 cat1이 불일치
  const incorrect = path_to_cat1 !== searchParams.get("cat1");

  if (incorrect) {
    console.log("경로와 cat1이 불일치");
    cleanData["cat1"] = path_to_cat1;
    const cleanSearchParams = new URLSearchParams(cleanData);
    redirectUrl = `?${cleanSearchParams.toString()}`;
  }

  return {
    ...cleanData,
    requireRedirect: redirectUrl,
  } as CheckParams;
};

export { useCheckParams };
