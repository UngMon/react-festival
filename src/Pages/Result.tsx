import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { useEffect } from "react";
import { getTCTRData } from "../redux/fetch-action";
import Card from "../components/card/Card";
import Loading from "../components/loading/Loading";
import "./Result.css";

const ResultPage = () => {
  const [params] = useSearchParams();
  const dispatch = useAppDispatch();
  const tcts = useSelector((state: RootState) => state.tcts);
  const title = params.get("title")!;
  const type = params.get("type")!;
  const keyword = params.get("keyword")!;
  console.log(tcts.serchRecord);
  console.log(title, type, keyword);
  useEffect(() => {
    // dispatch 중복 실행 방지.
    if (tcts.serchRecord[0]! === "pending") return;

    if (tcts.serchRecord[1] === type && tcts.serchRecord[2] === keyword)
      return;

    const parameter = {
      areaCode: "",
      title: "search",
      type,
      keyword,
    };
    console.log("??");
    console.log(parameter);
    dispatch(getTCTRData(parameter));
  }, [dispatch, title, type, keyword, tcts]);
  // if (festivalState.successGetData) {
  //   for (const item of festivalState.festivalArray) {
  //     const title = item.title.replace(/\s+/g, "");

  //     if (title.includes(keyword!)) {
  //       searchArray.push(item);
  //     }
  //   }
  // }

  return (
    <main className="main-box">
      <h3 className="result-title">{`' ${keyword} ' 검색 결과: ${tcts.searchArray?.length}개`}</h3>
      {tcts.serchRecord[0] !== "fulfiled" && <Loading />}
      {tcts.serchRecord[0] === "fulfiled" && tcts.searchArray?.length !== 0 && (
        <Card title="result" isSearch={true} />
      )}
      {tcts.serchRecord[0] === "fulfiled" && tcts.searchArray?.length === 0 && (
        <div className="result-not-found">
          <p>😅 검색한 축제가 없습니다!</p>
          <p>다시 검색해주세요!</p>
        </div>
      )}
    </main>
  );
};

export default ResultPage;
