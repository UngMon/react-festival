import { useSearchParams } from "react-router-dom";

export interface CheckParams {
  contentTypeId?: string;
  month?: string;
  areaCode?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  keyword?: string;
  page?: string;
  requireRedirect: string;
}

// 1. 타이틀에 따라 파라미터 분리 (Config Object)
const PARAM_CONFIG: Record<string, string[]> = {
  search: ["keyword", "contentTypeId", "page"],
  festival: ["month", "areaCode", "cat1", "cat2", "cat3"],
  default: ["areaCode", "cat1", "cat2", "cat3", "page"],
};

const useCheckParams = (title: string) => {
  const [searchParams] = useSearchParams();

  // 2. 현재 title에 맞는 필수 키 목록 가져오기 (없으면 default)
  const requiredKeys = PARAM_CONFIG[title] || PARAM_CONFIG["default"];

  // 3. 검증 및 정제 (단 한 번의 순회로 처리)
  const cleanParams = new URLSearchParams();

  // 필수 파라미터가 모두 있는지 확인 .every()를 사용하여 하나라도 만족하지 않으면 즉시 false 반환
  const hasAllRequired = requiredKeys.every((key) => {
    const value = searchParams.get(key);
    // 값이 없거나 공백만 있는 경우 실패 처리
    if (!value || !value.trim()) return false;

    cleanParams.set(key, value);
    return true;
  });

  // 4. 필수 파라미터 누락 시 -> 홈으로 리다이렉트
  if (!hasAllRequired) return { requireRedirect: "/" };

  // 5. 불필요한 파라미터 확인 (길이 비교 및 문자열 비교)
  // 정제된 파라미터 문자열과 현재 파라미터 문자열이 다르면 '불필요한 것'이 섞여있다는 뜻!
  // sort()를 통해 순서가 달라도 내용이 같으면 통과되도록 처리
  cleanParams.sort();
  searchParams.sort();

  const isDirty = cleanParams.toString() !== searchParams.toString();

  // 6. 결과 반환
  return {
    ...Object.fromEntries(cleanParams),
    // 불필요한 파라미터가 있다면 정제된 URL로, 아니면 빈 문자열
    requireRedirect: isDirty ? `?${cleanParams.toString()}` : "",
  } as CheckParams;
};

export { useCheckParams };
