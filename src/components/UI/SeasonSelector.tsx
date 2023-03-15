import { NavLink } from "react-router-dom";
import "./SeasonSelector.css";

interface SeasonProps {
  setSeason: (value: string) => void;
}

const SeasonSelctor = (props: SeasonProps) => {
  const clickSeasonHandler = (input: string) => {
    props.setSeason(input);
  };

  return (
    <nav className="season-selector-box">
      <ul>
        <NavLink
          to="/seasons/spring"
          onClick={() => clickSeasonHandler("spring")}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          #봄
        </NavLink>
        <NavLink
          to="/seasons/summer"
          onClick={() => clickSeasonHandler("summer")}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          #여름
        </NavLink>
        <NavLink
          to="/seasons/authumn"
          onClick={() => clickSeasonHandler("authumn")}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          #가을
        </NavLink>
        <NavLink
          to="/seasons/winter"
          onClick={() => clickSeasonHandler("winter")}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          #겨울
        </NavLink>
      </ul>
    </nav>
  );
};

export default SeasonSelctor;
