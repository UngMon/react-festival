import MonthSelector from "./MonthSelector";
import RegionSelector from "./RegionSelector";
import CategorySelector from "./CategorySelector";
import FestivalTags from "./FestivalTags";
import OnGoingSelector from "./OnGoingSelector";

interface Props {
    month?: string;
    setMonth?: (value: string) => void;
    areaCode?: string;
    setAreaCode?: (value: string) => void;
    cat2?: string;
    setCat2?: (value: string) => void;
    cat3?: string;
    setCat3?: (value: string) => void;
    행사상태?: [boolean, boolean, boolean];
    행사상태설정?: React.Dispatch<
      React.SetStateAction<[boolean, boolean, boolean]>
    >;
  }

const FestivalUi = (props: Props) => {
  return (
    <>
      <div id="picker-box">
        <MonthSelector
          month={props.month!}
          setMonth={props.setMonth!}
          areaCode={props.areaCode!}
        />
        <RegionSelector
          month={props.month!}
          areaCode={props.areaCode!}
          setAreaCode={props.setAreaCode!}
        />
        <CategorySelector
          category={props.cat2!}
          month={props.month!}
          areaCode={props.areaCode!}
          setCategory={props.setCat2!}
        />
      </div>
      <div className="Select-Table">
        <FestivalTags
          category={props.cat2!}
          cat3={props.cat3!}
          setCat3={props.setCat3!}
        />
      </div>
      <OnGoingSelector
        행사상태={props.행사상태!}
        행사상태설정={props.행사상태설정!}
      />
    </>
  );
};

export default FestivalUi;
