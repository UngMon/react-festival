import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Card from "../Card/Card";
import Loading from "../UI/Loading";
import UiBox from "../UI/UiBox";

const AllView = () => {

  const [month, setMonth] = useState<string>("전체");
  
  const festivalState = useSelector((state: RootState) => state.festival);

  return (
    <main className="main-box">
      <UiBox category={"all"} month={month} setMonth={setMonth} />
      {!festivalState.sortedMonth && <Loading />}
      {festivalState.sortedMonth && <Card type={"all"} month={month} />}
    </main>
  );
};

export default AllView;
