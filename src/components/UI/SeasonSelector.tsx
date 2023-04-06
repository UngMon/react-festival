import { NavLink, useNavigate } from "react-router-dom";
import "./SeasonSelector.css";

interface SeasonProps {
  season: string;
  setSeason: (value: string) => void;
}

const SeasonSelctor = (props: SeasonProps) => {
  const navigate = useNavigate();

  const seasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    props.setSeason(value);
    navigate(`/all-festival/month/${value}`);
  };

  const clickSeasonHandler = (input: string) => {
    props.setSeason(input);
  };

  return (
    <>
      {
        <nav>
          <ul className="season-selector-box">
            <li>
              <NavLink
                to="/seasons/spring"
                onClick={() => clickSeasonHandler("spring")}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                #봄
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seasons/summer"
                onClick={() => clickSeasonHandler("summer")}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                #여름
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seasons/authumn"
                onClick={() => clickSeasonHandler("authumn")}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                #가을
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seasons/winter"
                onClick={() => clickSeasonHandler("winter")}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                #겨울
              </NavLink>
            </li>
          </ul>
        </nav>
      }
      {
        <div className="picker-season">
          <select value={props.season} onChange={seasonChange}>
            <option value="default" disabled>
              계절을 선택하세요
            </option>
            <option value="spring">봄</option>
            <option value="summer">여름</option>
            <option value="authumn">가을</option>
            <option value="winter">겨울</option>
          </select>
        </div>
      }
    </>
  );
};

export default SeasonSelctor;
