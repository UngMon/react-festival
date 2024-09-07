import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faPrint,
  faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import "./PolicyNavigator.css";

const title: Record<string, string> = {
  "/etc/about": "소개",
  "/etc/privacypolicy": "개인정보처리약관",
  "/etc/service": "이용약관",
  "/etc/question": "Q&A",
};

const PolicyNavigator = () => {
  const url = `https://localhost:3000`;
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const menuClickHandler = () => {
    if (window.innerWidth < 1024) return;
    setOpen(!open);
  };

  const printRef = useRef<HTMLDivElement>(null);

  const onClickPrint = () => {
    window.print();
  };

  const handleCopyClipBoard = async (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      alert("클립보드에 링크가 복사되었습니다.");
    } catch (error: any) {
      alert(`에러가 발생했습니다! ${error.message}`);
    }
  };

  const listClickHandler = (text: string) => {
    navigate(text);
    setOpen(false);
  };

  return (
    <div className="PolicyNavigator-Container" ref={printRef}>
      <ol className="PolicyNavigator-Box">
        <li className="PolicyNavigator-Home">
          <a href="/">
            <img src="../images/home-white.png" alt="Home" />
          </a>
        </li>
        <li id="bar"></li>
        <li className="PolicyNavigator-Nav">
          <div onClick={menuClickHandler}>
            <span>{title[location.pathname]}</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              style={{ transform: open ? "rotate(180deg)" : "" }}
            />
          </div>
          <ul className={open ? "navi-open" : "navi-off"}>
            <li onClick={() => listClickHandler("/etc/about")}>소개</li>
            <li onClick={() => listClickHandler("/etc/privacypolicy")}>
              개인정보처리약관
            </li>
            <li onClick={() => listClickHandler("/etc/service")}>이용약관</li>
            <li onClick={() => listClickHandler("/etc/question")}>고객센터</li>
          </ul>
        </li>
        <li className="icons">
          <button onClick={onClickPrint}>
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </li>
        <li className="icons">
          <button
            type="button"
            onClick={() => handleCopyClipBoard(`${url}${location.pathname}`)}
          >
            <FontAwesomeIcon icon={faShareFromSquare} />
          </button>
        </li>
      </ol>
    </div>
  );
};

export default PolicyNavigator;
