import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { nowDate } from "../../utils/NowDate";
import "./PcMenu.css";

const PcMenu = () => {
  const { month } = nowDate();
  const [openNav, setOpenNav] = useState<boolean>(true);

  const clickCategory = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (!openNav) return;

    const resizeHandler = () => {
      if (window.innerWidth >= 1024) setOpenNav(false);
    };

    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, [openNav, setOpenNav]);

  return (
    <nav className="nav-container">
      <ul className="nav-box">
        <li>
          <NavLink
            to={`/tour?contentTypeId=12&areaCode=0&cat1=all&cat2=all&cat3=all`}
            onClick={clickCategory}
          >
            관광지
          </NavLink>
          <i />
        </li>
        <li>
          <NavLink
            to="/culture?contentTypeId=14&areaCode=0&cat1=A02&cat2=all&cat3=all"
            onClick={clickCategory}
          >
            문화시설
          </NavLink>
          <i />
        </li>
        <li>
          <NavLink
            to={`/festival?contentTypeId=15&month=${month}&areaCode=0&cat1=A02&cat2=all&cat3=all`}
            onClick={clickCategory}
          >
            축제/공연/행사
          </NavLink>
          <i />
        </li>
        <li>
          <NavLink
            to={`/travel?contentTypeId=25&areaCode=0&cat1=C01&cat2=all&cat3=all`}
            onClick={clickCategory}
          >
            여행코스
          </NavLink>
          <i />
        </li>
        <li>
          <NavLink
            to={`/travel?contentTypeId=28&areaCode=0&cat1=A03&cat2=all&cat3=all`}
            onClick={clickCategory}
          >
            레포츠
          </NavLink>
          <i />
        </li>
        <li>
          <NavLink
            to={`/travel?contentTypeId=32&areaCode=0&cat1=B02&cat2=B0201&cat3=all`}
            onClick={clickCategory}
          >
            숙박
          </NavLink>
          <i />
        </li>
        <li>
          <NavLink
            to={`/travel?contentTypeId=38&areaCode=0&cat1=A04&cat2=A0401&cat3=all`}
            onClick={clickCategory}
          >
            쇼핑
          </NavLink>
          <i />
        </li>
        <li>
          <NavLink
            to={`/travel?contentTypeId=39&areaCode=0&cat1=A05&cat2=A0502&cat3=all`}
            onClick={clickCategory}
          >
            음식점
          </NavLink>
          <i />
        </li>
      </ul>
    </nav>
  );
};

export default PcMenu;
