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
  cat2Code,
  cat3Code,
  TitleType,
} from "../../type/FetchType";
import useAllParams, { CheckParams } from "../../hooks/useCheckParams";
import LoadingSpinnerTwo from "../loading/LoadingSpinnerTwo";
import "./Result.css";

interface T {
  title: TitleType;
}

let isFirst = true;

const Result = ({ title }: T) => {
  const tourData = useSelector((state: RootState) => state.data);
  const params = useAllParams(title) as CheckParams;
  const { contentTypeId, keyword } = params;
  const key = keyword + (contentTypeId ?? "");
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    switch (true) {
      case params.requireRedirect !== "":
        navigate(params.requireRedirect);
        return;
      case tourData.httpState === "pending":
        return;
      case tourData.httpState === "fulfiled":
        return;
      case !isFirst:
        return;
    }

    if (tourData[title][key]) return;

    isFirst = false;

    dispatch(
      getTourApiData({
        numOfRows: 25,
        page: Math.ceil((tourData.search[key] || []).length / 50),
        title,
        params: params as CheckParams,
      })
    );
  }, [dispatch, navigate, params, key, tourData, title]);

  const sigunHandler = (item: Item): string => {
    if (!item.areacode || !item.sigungucode) return "";
    const 지역 = 지역코드[item.areacode];
    const 시군구 = 시군코드[지역코드[item.areacode]][item.sigungucode];
    return `${지역} ${시군구}`;
  };

  return (
    <section className="Result-Container">
      <div className="Result-Box">
        <div className="Result-Title">
          <span>{`~~의 검색 결과`}</span>
        </div>
        {tourData.httpState === "pending" && (
          <LoadingSpinnerTwo width="100" padding="5" />
        )}
        {tourData.httpState !== "pending" && (
          <div className="Result-Cards">
            {tourData.search[key] ? (
              tourData.search[key].map((item, index) => (
                <article key={index}>
                  <div className="Result-Card-Image">
                    <img alt={item.title} src={item.firstimage} />
                  </div>
                  <div className="Result-Card-Title">
                    <span>{item.title}</span>
                  </div>
                  <div className="Result-Card-Sigun">
                    <span>{sigunHandler(item)}</span>
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
