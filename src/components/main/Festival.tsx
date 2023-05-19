import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import Card from "../card/Card";
import UiBox from "../ui/UiBox";
import Loading from "../ui/loading/Loading";

const Monthly = () => {
  const dispatch = useAppDispatch();
  const festivalState = useSelector((state: RootState) => state.festival);
  // 현재 쿼리 매개변수 값 기준으로 화면에 렌더링
  const [searchParams, setSearchParams] = useSearchParams();
  const [month, setMonth] = useState<string>(searchParams.get("month")!);
  const [areaCode, setAreaCode] = useState<string>(searchParams.get("region")!);
  const [cat2, setCat2] = useState<string>("all");
  const [cat3, setCat3] = useState<string>("all");
  const [행사상태, 행사상태설정] = useState<[boolean, boolean, boolean]>([
    true,
    false,
    false,
  ]);

  useEffect(() => {
    if (festivalState.successGetData && !festivalState.sortedFestivalArr) {
      dispatch(festivalActions.sortFestivalArray());
    }
  }, [dispatch, festivalState]);

  return (
    <main className="main-box">
      {festivalState.successGetData && (
        <UiBox
          title={"festival"}
          month={month}
          setMonth={setMonth}
          areaCode={areaCode}
          setAreaCode={setAreaCode}
          cat2={cat2}
          setCat2={setCat2}
          cat3={cat3}
          setCat3={setCat3}
          행사상태={행사상태}
          행사상태설정={행사상태설정}
        />
      )}
      {!festivalState.sortedFestivalArr ? (
        <Loading />
      ) : (
        <Card
          title="festival"
          month={month}
          areaCode={areaCode}
          cat2={cat2}
          cat3={cat3}
          행사상태={행사상태}
        />
      )}
    </main>
  );
};

export default Monthly;
