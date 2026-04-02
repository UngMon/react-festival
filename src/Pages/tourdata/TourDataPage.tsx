import { useCheckParams } from "hooks/useCheckParams";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Card from "../../features/card/Card";
import Selectors from "../../features/selector/Selectors";
import PageButton from "../../features/selector/PageButton";

const TourDataPage = () => {
  const [numOfRows, setNumOfRows] = useState<number>(50);
  const params = useCheckParams();

  if (params.requireRedirect !== "") {
    console.log("requireRedirect !==  ");
    return <Navigate to={params.requireRedirect} replace={true} />;
  }

  return (
    <main>
      <Selectors
        numOfRows={numOfRows}
        params={params}
        setNumOfRows={setNumOfRows}
      />
      <Card numOfRows={numOfRows} params={params} />
      {params.cat1 !== "EV" && (
        <PageButton numOfRows={numOfRows} params={params} />
      )}
    </main>
  );
};

export default TourDataPage;
