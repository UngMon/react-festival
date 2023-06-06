import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

interface T {
  title: string;
  month: string;
}

const SubMenu = ({ title, month }: T) => {
  console.log('???????')

  return (
    <nav className="subnav">
      <ul className="submenu">
        <li>
          <Link to="/">
            <img src="/images/icons/home.png" alt="홈" width="25" />
          </Link>
        </li>
        <li>
          <FontAwesomeIcon icon={faChevronRight} />
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
        {title === "result" && (
          <li>
            <Link to="/travel/search?areaCode=1&cat1=all&cat2=all&cat3=all">
              검색결과
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default SubMenu;
