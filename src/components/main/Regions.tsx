import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Card from "../Card/Card";
import Loading from "../UI/Loading";
import UiBox from "../UI/UiBox";

const Regions = () => {

  const [areaCode, setAreaCode] = useState<string>("0");
  
  const festivalState = useSelector((state: RootState) => state.festival);

  return (
    <main className="main-box">
      <UiBox category="region" areaCode={areaCode} setAreaCode={setAreaCode} />
      {!festivalState.sortedRegion && <Loading />}
      {festivalState.sortedRegion && (
        <Card type="region" month="전체" areaCode={areaCode} />
      )}
    </main>
  );
};

export default Regions;
