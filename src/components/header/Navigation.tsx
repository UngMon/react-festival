import { NavLink } from "react-router-dom";
import "./Navigation.css";

interface T {
  pathname: string;
  scrollY: number;
  mouseOver: boolean;
  setOpenSearch: (value: boolean) => void;
}

const Navigation = ({ pathname, scrollY, mouseOver, setOpenSearch }: T) => {
  // const dispatch = useAppDispatch();
  const thisMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  const clickCategory = (value?: string) => {
    window.scrollTo(0, 0);
    setOpenSearch(false);
  };

  return (
    <>
      <nav
        className={`pc-nav-bar ${
          pathname === "/" && scrollY === 0 && !mouseOver && "no-border"
        }`}
      >
        <ul className="Nav-box">
          <li>
            <NavLink
              to={`/tour/search?type=12&areaCode=1&cat1=all&cat2=all&cat3=all`}
              onClick={() => clickCategory("tour")}
              style={({ isActive }) => {
                return {
                  color: isActive
                    ? "orange"
                    : pathname === "/" && scrollY === 0 && !mouseOver
                    ? "white"
                    : "#333",
                };
              }}
            >
              관광지
            </NavLink>
          </li>
          <li>
            <NavLink
              to="culture/search?type=14&areaCode=1&cat1=A02&cat2=all&cat3=all"
              onClick={() => clickCategory("culture")}
              style={({ isActive }) => {
                return {
                  color: isActive
                    ? "orange"
                    : pathname === "/" && scrollY === 0 && !mouseOver
                    ? "white"
                    : "#333",
                };
              }}
            >
              문화시설
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/festival/search?type=15&month=${thisMonth}&areaCode=0&cat1=A02&cat2=all&cat3=all`}
              onClick={() => clickCategory("festival")}
              style={({ isActive }) => {
                return {
                  color: isActive
                    ? "orange"
                    : pathname === "/" && scrollY === 0 && !mouseOver
                    ? "white"
                    : "#333",
                };
              }}
            >
              축제/공연/행사
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/travel/search?type=25&areaCode=1&cat1=C01&cat2=all&cat3=all`}
              onClick={() => clickCategory("travel")}
              style={({ isActive }) => {
                return {
                  color: isActive
                    ? "orange"
                    : pathname === "/" && scrollY === 0 && !mouseOver
                    ? "white"
                    : "#333",
                };
              }}
            >
              여행코스
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
