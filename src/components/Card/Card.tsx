import { TourDataType } from "type/FetchType";
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
  tourDataType: TourDataType;
  numOfRows: number;
  page: number;
  params: CheckParams;
}

const Card = ({ tourDataType, numOfRows, page, params }: CardProps) => {
  console.log('Card')
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const key = generatePageKey(tourDataType, params, numOfRows, page);
  const httpState = useSelector((state: RootState) => state.data.httpState);
  const page_record = useSelector((state: RootState) => state.data.page_record);
  const tourData = useSelector(
    (state: RootState) => state.data[tourDataType][key]
  );

  useEffect(() => {
    if (params.requireRedirect !== "") {
      navigate(params.requireRedirect);
      return;
    }

    // 데이터 요청이 진행 중이거나 이미 해당 페이지 데이터가 있으면 재요청 방지
    if (httpState === "pending" || page_record.includes(key)) return;

    dispatch(
      fetchTourApi({
        numOfRows,
        page,
        tourDataType,
        params,
      })
    );
  }, [
    dispatch,
    navigate,
    page,
    params,
    numOfRows,
    tourDataType,
    httpState,
    key,
    page_record,
  ]);

  return (
    <article
      className={`main-box-content ${tourDataType === "search" && "result"}`}
    >
      <div className="AllView-grid-box">
        {httpState === "fulfilled" && tourData && (
          <CardItem
            params={params}
            tourDataType={tourDataType}
            tourDataArray={tourData.tourData}
            numOfRows={numOfRows}
            page={page}
          />
        )}
        {httpState === "pending" && <Loading height="500px" />}
        {httpState === "rejected" && <GetDataError />}
      </div>
    </article>
  );
};

export default Card;

