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
  numOfRows: number;
  params: CheckParams;
}

const Card = ({ numOfRows, params }: CardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const page_key = createPageKey(numOfRows, params);
  const httpState = useSelector((state: RootState) => state.tour.httpState);
  const page_record = useSelector((state: RootState) => state.tour.page_record);
  const dataArray = useSelector(
    (state: RootState) => state.tour.datas[page_key],
  );

  useEffect(() => {
    // 데이터 요청이 진행 중이거나 이미 해당 페이지 데이터가 있으면 재요청 방지
    if (httpState === "pending" || page_record.includes(page_key)) return;

    dispatch(fetchTourApi({ numOfRows, params }));
  }, [dispatch, navigate, params, numOfRows, httpState, page_key, page_record]);

  return (
    <article className={`main-box-content`}>
      <div className="AllView-grid-box">
        {httpState === "fulfilled" && dataArray && (
          <CardItem params={params} tourDataArray={dataArray.tourData} />
        )}
        {httpState === "pending" && <Loading height="500px" />}
        {httpState === "rejected" && <GetDataError />}
      </div>
    </article>
  );
};

export default Card;
