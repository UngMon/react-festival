import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { getTourApiData } from "../../redux/fetch-action";
import {
  ContentIdCode,
  지역코드,
  시군코드,
  Item,
  cat1Code,
  cat2Code,
  cat3Code,
} from "../../type/Common";
import useAllParams from "../../hooks/useAllParams";
import LoadingSpinnerTwo from "../loading/LoadingSpinnerTwo";

import "./Result.css";

interface T {
  title: string;
}

let isFirst = true;

const Result = ({ title }: T) => {
  const dataState = useSelector((state: RootState) => state.data);
  const { contentTypeId, keyword, requireRedirect } = useAllParams(title);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const [page, setPage] = useState<string>("0");

  useEffect(() => {
    switch (true) {
      case requireRedirect !== "":
        navigate(requireRedirect);
        return;
      case dataState.httpState === "pending":
        return;
      case dataState.httpState === "fulfiled" &&
        dataState.serchRecord[keyword][contentTypeId] === "complete":
        return;
      case !isFirst:
        return;
    }

    const parameter = {
      contentTypeId,
      title: title as "result",
      areaCode: "0",
      cat1: "all",
      cat2: "all",
      cat3: "all",
      page,
      keyword,
    };
    isFirst = false;
    dispatch(getTourApiData(parameter));
  }, [
    dispatch,
    navigate,
    requireRedirect,
    dataState,
    keyword,
    contentTypeId,
    page,
    title,
  ]);

  const sigunHandler = (item: Item, index: number): string => {
    // console.log(item.areacode, item.sigungucode, item.title, index);
    if (!item.areacode || !item.sigungucode) return "";
    const 지역 = 지역코드[item.areacode];
    const 시군구 = 시군코드[지역코드[item.areacode]][item.sigungucode];
    // console.log(`지역코드 ${지역코드[item.areacode]}`);

    return `${지역} ${시군구}`;
  };

  return (
    <section className="Result-Container">
      <div className="Result-Box">
        <div className="Result-Title">
          <span>{`~~의 검색 결과`}</span>
        </div>
        {dataState.httpState === "pending" && (
          <LoadingSpinnerTwo width="100" padding="5" />
        )}
        {dataState.httpState !== "pending" && (
          <div className="Result-Cards">
            {dataState.검색?.[keyword]?.[contentTypeId] ? (
              dataState.검색[keyword][contentTypeId].map((item, index) => (
                <article key={index}>
                  <div className="Result-Card-Image">
                    <img alt={item.title} src={item.firstimage} />
                  </div>
                  <div className="Result-Card-Title">
                    <span>{item.title}</span>
                  </div>
                  <div className="Result-Card-Sigun">
                    <span>{sigunHandler(item, index)}</span>
                  </div>
                  <div className="Result-Card-Hash">
                    {ContentIdCode[item.contenttypeid] && (
                      <span>{`#${ContentIdCode[item.contenttypeid]}`}</span>
                    )}
                    {cat2Code[item.cat2] && (
                      <span>{`#${cat2Code[item.cat2]}`}</span>
                    )}
                    {cat3Code[item.cat3] && (
                      <span>{`#${cat3Code[item.cat3]}`}</span>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div>검색 결과가 없습니다!</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Result;
