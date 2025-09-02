import { TitleType } from "type/FetchType";
import { CheckParams } from "hooks/useCheckParams";
import { useEffect } from "react";
import { RootState, useAppDispatch } from "store/store";
import { useSelector } from "react-redux";
import { fetchTourApi } from "api/fetchTourApi";
import { useNavigate } from "react-router-dom";
import { generatePageKey } from "utils/generatePageKey";
import Loading from "../Loading/Loading";
import GetDataError from "../Error/GetDataError";
import CardItem from "./CardItem";
import "./Card.css";

interface CardProps {
  title: TitleType;
  numOfRows: number;
  page: number;
  params: CheckParams;
}

const Card = ({ title, numOfRows, page, params }: CardProps) => {
  console.log("Card Render");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tourData = useSelector((state: RootState) => state.data);

  useEffect(() => {
    if (params.requireRedirect !== "") {
      navigate(params.requireRedirect);
      return;
    }

    const key = generatePageKey(title, params, numOfRows, page);

    if (tourData.page_record.includes(key)) return;

    // 데이터 요청이 진행 중이거나 이미 해당 페이지 데이터가 있으면 재요청 방지
    if (tourData.httpState === "pending" || tourData.page_record.includes(key))
      return;

    dispatch(
      fetchTourApi({
        numOfRows,
        page,
        title,
        params: params as CheckParams,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate, page, params, numOfRows, title]);

  return (
    <article className={`main-box-content ${title === "search" && "result"}`}>
      <div className="AllView-grid-box">
        {
          <CardItem
            params={params}
            title={title}
            tourData={tourData}
            numOfRows={numOfRows}
            page={page}
          />
        }
        {tourData.loading && <Loading height="500px" />}
        {!tourData.loading && !tourData.successGetData && <GetDataError />}
      </div>
    </article>
  );
};

export default Card;
