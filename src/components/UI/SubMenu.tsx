import { Link } from "react-router-dom";

interface T {
  title: string;
  month: string;
  cat1: string;
  cat2: string;
  cat3: string;
}

const SubMenu = ({ title, month, cat1, cat2, cat3 }: T) => {
  return (
    <nav className="subnav">
      <ul className="submenu">
        <li>
          <img src="/images/icons/home.png" alt="홈" width="25" />
          <Link to="/">홈</Link>
        </li>
        {title === "tour" && (
          <>
            <li>
              <Link to="/tour/search?areaCode=1&cat1=all&cat2=all&cat3=all">
                관광지
              </Link>
            </li>
          </>
        )}
        {title === "culture" && (
          <li>
            <Link to="/culture/search?areaCode=1&cat1=all&cat2=all&cat3=all">
              문화시설
            </Link>
          </li>
        )}
        {title === "festival" && (
          <li>
            <Link
              to={`/festival/search?month=${month}&areaCode=1&cat1=all&cat2=all&cat3=all`}
            >
              축제/공연/행사
            </Link>
          </li>
        )}
        {title === "travel" && (
          <li>
            <Link to="/travel/search?areaCode=1&cat1=all&cat2=all&cat3=all">
              여행코스
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default SubMenu;
