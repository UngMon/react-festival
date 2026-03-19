import { TourDataType } from "types/FetchType";
import { useCheckParams } from "hooks/useCheckParams";
import { useState } from "react";
import Card from "../../features/card/Card";
import Selectors from "../../features/selector/Selectors";
import SearchPage from "pages/search/SearchPage";
import PageButton from "../../features/selector/PageButton";

interface T {
  tourDataType: TourDataType;
}

const TourDataPage = ({ tourDataType }: T) => {
  const [numOfRows, setNumOfRows] = useState<number>(50);
  const [page, setPage] = useState<number>(1);
  const params = useCheckParams(tourDataType);

  return (
    <main>
      {tourDataType !== "search" ? (
        <>
          <Selectors
            numOfRows={numOfRows}
            params={params}
            setNumOfRows={setNumOfRows}
          />
          <Card
            tourDataType={tourDataType}
            numOfRows={numOfRows}
            params={params}
          />
        </>
      ) : (
        <SearchPage
          tourDataType={tourDataType}
          params={params}
          page={page}
          setPage={setPage}
        />
      )}
      {tourDataType !== "festival" && (
        <PageButton
          tourDataType={tourDataType}
          numOfRows={numOfRows}
          params={params}
        />
      )}
    </main>
  );
};

export default TourDataPage;
