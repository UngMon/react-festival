import { Item } from "type/FetchType";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { generatePageKey } from "utils/generatePageKey";
import { TourDataType } from "type/FetchType";
import { CheckParams } from "./useCheckParams";

const useTourData = (
  title: TourDataType,
  params: CheckParams,
  numOfRows: number,
  page: number
): Item[] | null => {
  // 1. 키 생성 로직을 여기서 수행
  const key = generatePageKey(title, params, numOfRows, page);
  console.log('useTourData')
  // 2. 리덕스에서 데이터 가져오기
  const page_record = useSelector((state: RootState) => state.data.page_record);
  const httpState = useSelector((state: RootState) => state.data.httpState);
  const data = useSelector(
    (state: RootState) => state.data[title]?.[key]?.tourData
  );

  if (page_record.includes(key)) return null;

  // 데이터 요청이 진행 중이거나 이미 해당 페이지 데이터가 있으면 재요청 방지
  if (httpState === "pending") return null;

  // 3. 데이터가 없으면 빈 배열 반환
  return data;
};

export { useTourData };
