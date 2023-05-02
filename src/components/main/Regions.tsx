import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import Card from "../card/Card";
import Loading from "../ui/Loading";
import UiBox from "../ui/UiBox";
import GetDataError from "../error/GetDataError";

const Regions = () => {
  const dispatch = useAppDispatch();
  const { regionKey } = useParams();
  const [areaCode, setAreaCode] = useState<string>(regionKey || "0");
  const festivalState = useSelector((state: RootState) => state.festival);

  useEffect(() => {
    //새로고침(마운트)시 리덕스 스테이트 업데이트
    if (festivalState.successGetData && !festivalState.sortedRegion) {
      dispatch(festivalActions.sortDataByRegion());
    }
  }, [dispatch, festivalState]);

  return (
    <main className="main-box">
      {festivalState.successGetData && (
        <UiBox
          category="region"
          areaCode={areaCode}
          setAreaCode={setAreaCode}
        />
      )}
      {festivalState.loading ? (
        <Loading />
      ) : (
        !festivalState.successGetData && <GetDataError />
      )}
      {festivalState.sortedRegion && (
        <Card type="region" month="all" areaCode={areaCode} />
      )}
    </main>
  );
};

export default Regions;
