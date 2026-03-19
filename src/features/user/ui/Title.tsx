import { CATEGORY_EXPLANATION, CATEGORY_TITLES } from "../constant/constant";
import "./Title.css";

interface Props {
  category: string;
}

const Title = ({ category }: Props) => {
  return (
    <div className="user-page-title">
      <h2>{CATEGORY_TITLES[category]}</h2>
      <p>{CATEGORY_EXPLANATION[category]}</p>
    </div>
  );
};

export default Title;
