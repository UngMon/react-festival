import { TitleType } from "type/FetchType";
import { useState } from "react";
import Card from "./Card";
import Selectors from "../Selectors/Selectors";
import Result from "pages/Result/Result";
import PageButton from "../Selectors/PageButton";
import {useCheckParams} from "hooks/useCheckParams";

interface T {
  title: TitleType;
}

const CardContainer = ({ title }: T) => {
  const [numOfRows, setNumOfRows] = useState<number>(50);
  const [page, setPage] = useState<number>(1);
  const params = useCheckParams(title);

  return (
    <main>
      {title !== "search" ? (
        <>
          <Selectors
            title={title}
            numOfRows={numOfRows}
            setNumOfRows={setNumOfRows}
          />
          <Card
            title={title}
            numOfRows={numOfRows}
            page={page}
            params={params}
          />
        </>
      ) : (
        <Result title={title} page={page} params={params} />
      )}
      {title !== "festival" && (
        <PageButton
          title={title}
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
