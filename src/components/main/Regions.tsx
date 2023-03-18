import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import Card from "../Card/Card";
import Loading from "../UI/Loading";
import UiBox from "../UI/UiBox";

const Regions = () => {
  const { regionKey } = useParams();
  const [areaCode, setAreaCode] = useState<string>(regionKey || "0");
  const festivalState = useSelector((state: RootState) => state.festival);

  const dispatch = useAppDispatch();
  const festivalArray = sessionStorage.getItem('festivalArray') || '';

  useEffect(() => {
    //새로고침(마운트)시 리덕스 스테이트 업데이트
    dispatch(festivalActions.sortDataByRegion(JSON.parse(festivalArray)))
  }, [dispatch, festivalArray])

  return (
    <main className="main-box">
      <UiBox category="region" areaCode={areaCode} setAreaCode={setAreaCode} />
      {!festivalState.sortedRegion && <Loading />}
      {festivalState.sortedRegion && (
        <Card type="region" month="all" areaCode={areaCode} />
      )}
    </main>
  );
};

export default Regions;
