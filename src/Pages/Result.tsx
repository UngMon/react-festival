import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { useEffect, useState } from "react";
import { getTCTRData } from "../redux/fetch-action";
import UiBox from "../components/ui/UiBox";
import Card from "../components/card/Card";
import Loading from "../components/ui/loading/Loading";
import "./Result.css";

const ResultPage = () => {
  const [params] = useSearchParams();
  const dispatch = useAppDispatch();
  const tcts = useSelector((state: RootState) => state.tcts);
  const title = params.get("title")!;
  const type = params.get("type")!;
  const keyword = params.get("keyword")!;
  // const [key, setKey] = useState<[string, string]>([title, keyword])
  console.log(tcts.serchRecord);

  useEffect(() => {
    // dispatch 중복 실행 방지.
    if (tcts.serchRecord[0]! === "pending") return;

    if (tcts.serchRecord[1] === title && tcts.serchRecord[2] === keyword)
      return;
    // if (key[0] === title && key[1] === keyword) return;

    if (tcts.searchArray?.length === 0) {
      const parameter = {
        areaCode: "",
        title: "search",
        type,
        keyword,
      };
      console.log("??");
      console.log(parameter);
      dispatch(getTCTRData(parameter));
      // setKey([title, keyword])
    }
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
      {/* <UiBox title="result" /> */}
      {tcts.serchRecord[0] !== 'fulfiled' && <Loading />}
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
