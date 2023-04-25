import { NavLink, useNavigate } from "react-router-dom";
import "./SeasonSelector.css";

interface SeasonProps {
  season: string;
  setSeason: (value: string) => void;
}

const SeasonSelctor = ({season, setSeason}: SeasonProps) => {
  const navigate = useNavigate();

  const seasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSeason(value);
    navigate(`/season/${value}`);
  };

  return (
    <>
      {
        <nav>
          <ul className="season-selector-box">
            <li>
              <NavLink
                to="/seasons/spring"
                onClick={() => setSeason("spring")}
                style={({ isActive }) => {
                  return {
                    color: isActive ? "#F8D1D1" : "",
                  };
                }}
              >
                #봄
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seasons/summer"
                onClick={() => setSeason("summer")}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                #여름
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seasons/authumn"
                onClick={() => setSeason("authumn")}
                style={({ isActive }) => {
                  return {
                    color: isActive ? "#E15024" : "",
                  };
                }}
              >
                #가을
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seasons/winter"
                onClick={() => setSeason("winter")}
                style={({ isActive }) => {
                  return {
                    color: isActive ? "skyblue" : "",
                  };
                }}
              >
                #겨울
              </NavLink>
            </li>
          </ul>
        </nav>
      }
      {
        <div className="picker-season">
          <select value={season} onChange={seasonChange}>
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
