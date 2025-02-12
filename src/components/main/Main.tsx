import { TitleType } from "../../type/FetchType";
import { useState } from "react";
import Card from "../card/Card";
import Picker from "../ui/Picker";
import Result from "../main/Result";
import PageButton from "../card/PageButton";

interface T {
  title: TitleType;
}

const Main = ({ title }: T) => {
  const [numOfRows, setNumOfRows] = useState<number>(50);
  const [page, setPage] = useState<number>(1);

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
          <Card title={title} numOfRows={numOfRows} page={page} />
        </>
      ) : (
        <Result title={title} />
      )}
      {title !== "festival" && (
        <PageButton
          title={title}
          numOfRows={numOfRows}
          page={page}
          setPage={setPage}
        />
      )}
    </main>
  );
};

export default Main;
