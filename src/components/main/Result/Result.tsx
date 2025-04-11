import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../redux/store";
import useCheckParams, { CheckParams } from "../../../hooks/useCheckParams";
import { useNavigate } from "react-router-dom";
import { getTourApiData } from "../../../redux/fetch-action";
import { ContentIdCode, TitleType } from "../../../type/FetchType";
import Input from "./Input";
import ResultCard from "./ResultCard";
import "./Result.css";

interface T {
  title: TitleType;
  params: CheckParams
  page: number;
}

const Result = ({ title, params, page }: T) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tourData = useSelector((state: RootState) => state.data);
  const { contentTypeId, keyword } = params;
  const key = `${contentTypeId}-${keyword}-${page}`
  const pageKey = `${contentTypeId}-${keyword}`;
  const [typeId, setTypeId] = useState<[string, string]>([
    `${contentTypeId ?? "0"}`,
    ContentIdCode[contentTypeId ?? "0"],
  ]);

  useEffect(() => {
    switch (true) {
      case params.requireRedirect !== "":
        navigate(params.requireRedirect);
        return;
      case tourData.httpState === "pending":
        return;
      case tourData.httpState === "fulfiled":
        return;
    }

    if (tourData[title][key]) {
      console.log('uesEffect');
      return;
    }
    //Math.ceil((tourData.search[key] || [""]).length / 50)
    dispatch(
      getTourApiData({
        existPageInfo: tourData.cat_page_record[pageKey] ? true : false,
        numOfRows: 25,
        page,
        title,
        params: params as CheckParams,
      })
    );
  }, [dispatch, navigate, params, key, pageKey, tourData, title, page]);

  return (
    <section className="Result-Container">
      <Input
        keyword={keyword}
        ContentIdCode={ContentIdCode}
        contentTypeId={contentTypeId}
        typeId={typeId}
        setTypeId={setTypeId}
      />
      <ResultCard
        idkey={key}
        tourData={tourData}
        contentTypeId={contentTypeId}
        ContentIdCode={ContentIdCode}
      />
    </section>
  );
};

export default Result;
