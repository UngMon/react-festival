import { TitleType } from "../../type/FetchType";
import { useState } from "react";
import Card from "../card/Card";
import Picker from "../ui/Picker";
import Result from "./Result/Result";
import PageButton from "../card/PageButton";
import useCheckParams from "../../hooks/useCheckParams";

interface T {
  title: TitleType;
}

const Main = ({ title }: T) => {
  const [numOfRows, setNumOfRows] = useState<number>(50);
  const [page, setPage] = useState<number>(1);
  const params = useCheckParams(title);
  console.log("????", title);
  return (
    <main>
      {title !== "search" ? (
        <>
          <Picker
            title={title}
            page={page}
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

export default Main;
