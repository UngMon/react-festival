import { TourDataType } from "type/FetchType";
import { useState } from "react";
import Card from "./Card";
import Selectors from "../Selectors/Selectors";
import Result from "pages/Result/Result";
import PageButton from "../Selectors/PageButton";
import {useCheckParams} from "hooks/useCheckParams";

interface T {
  tourDataType: TourDataType;
}

const CardContainer = ({ tourDataType }: T) => {
  const [numOfRows, setNumOfRows] = useState<number>(50);
  const [page, setPage] = useState<number>(1);
  const params = useCheckParams(tourDataType);

  return (
    <main>
      {tourDataType !== "search" ? (
        <>
          <Selectors
            tourDataType={tourDataType}
            numOfRows={numOfRows}
            setNumOfRows={setNumOfRows}
            setPage={setPage}
          />
          <Card
            tourDataType={tourDataType}
            numOfRows={numOfRows}
            page={page}
            params={params}
          />
        </>
      ) : (
        <Result tourDataType={tourDataType} page={page} params={params} />
      )}
      {tourDataType !== "festival" && (
        <PageButton
          tourDataType={tourDataType}
          numOfRows={numOfRows}
          params={params}
          page={page}
          setPage={setPage}
        />
      )}
    </main>
  );
};

export default CardContainer;
