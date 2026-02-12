import { TourDataType } from "types/FetchType";
import { CheckParams } from "hooks/useCheckParams";
import { useEffect } from "react";
import { RootState, useAppDispatch } from "store/store";
import { useSelector } from "react-redux";
import { fetchTourApi } from "api/fetchTourApi";
import { useNavigate } from "react-router-dom";
import { createPageKey } from "utils/createPageKey";
import Loading from "../../common/loading/Loading";
import GetDataError from "../../common/error/GetDataError";
import CardItem from "./CardItem";
import "./Card.css";

interface CardProps {
  tourDataType: TourDataType;
  numOfRows: number;
  params: CheckParams;
}

const Card = ({ tourDataType, numOfRows, params }: CardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const page_key = createPageKey(tourDataType, numOfRows, params);
  const httpState = useSelector((state: RootState) => state.data.httpState);
  const page_record = useSelector((state: RootState) => state.data.page_record);
  const tourData = useSelector(
    (state: RootState) => state.data[tourDataType]?.[page_key]
  );

  useEffect(() => {
    if (params.requireRedirect !== "") {
      navigate(params.requireRedirect);
      return;
    }
    
    // 데이터 요청이 진행 중이거나 이미 해당 페이지 데이터가 있으면 재요청 방지
    if (httpState === "pending" || page_record.includes(page_key)) return;

    dispatch(fetchTourApi({ numOfRows, tourDataType, params }));
  }, [
    dispatch,
    navigate,
    params,
    numOfRows,
    tourDataType,
    httpState,
    page_key,
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
          />
        )}
        {httpState === "pending" && <Loading height="500px" />}
        {httpState === "rejected" && <GetDataError />}
      </div>
    </article>
  );
};

export default Card;
