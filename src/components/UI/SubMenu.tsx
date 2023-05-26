import { Link } from "react-router-dom";

interface T {
  title: string;
}

const SubMenu = ({ title }: T) => {
  return (
    <nav className="subnav">
      <ul className="submenu">
        <li>
          <img src="/images/icons/home.png" alt="홈" width="35" />
        </li>
        {title === "tour" && (
          <li>
            <Link to="/tour/search?region=1&cat1=all&cat2=all&cat3=all">
              관광지
            </Link>
          </li>
        )}
        {title === "tour" && <li></li>}
        {title === "culture" && (
          <li>
            <Link to="/culture/search?region=1&cat1=all&cat2=all&cat3=all">
              문화시설
            </Link>
          </li>
        )}
        {title === "festival" && (
          <li>
            <Link to="/festival/search?region=1&cat1=all&cat2=all&cat3=all">
              지역 축제/행사
            </Link>
          </li>
        )}
        {title === "travel" && (
          <li>
            <Link to="/travel/search?region=1&cat1=all&cat2=all&cat3=all">
              여행코스
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default SubMenu;
