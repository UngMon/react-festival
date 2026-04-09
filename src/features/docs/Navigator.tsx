import { Link, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import "./Navigator.css";

const title: Record<string, string> = {
  "/docs/about": "소개",
  "/docs/privacypolicy": "개인정보처리약관",
  "/docs/service": "이용약관",
  "/docs/question": "Q&A",
};

const Navigator = () => {
  const url = `https://localhost:3000`;
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleCopyClipBoard = async (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      alert("클립보드에 링크가 복사되었습니다.");
    } catch (error: any) {
      alert(`에러가 발생했습니다! ${error.message}`);
    }
  };

  return (
    <nav className="policy-nav" ref={printRef} aria-label="정책 네비게이션">
      <ul className="policy-nav__list">
        <li className="policy-nav__item policy-nav__item--home">
          <Link to="/" className="policy-nav__home-link">
            <span className="material-symbols-outlined">home</span>
          </Link>
        </li>
        <li className="policy-nav__item policy-nav__item--dropdown">
          <button
            type="button"
            className="policy-nav__trigger"
            onClick={() => setOpen(!open)}
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls="policy-menu"
          >
            <span className="policy-nav__title">
              {title[location.pathname]}
            </span>
            <span
              className={`material-symbols-outlined ${open ? "policy-nav__title--is-open" : ""}`}
            >
              keyboard_arrow_down
            </span>
          </button>
          <ul
            className={`policy-nav__menu ${open ? "policy-nav__menu--is-open" : ""}`}
          >
            <li className="policy-menu__item">
              <Link
                className="policy-menu__item-link"
                to="/docs/about"
                onClick={() => setOpen(false)}
              >
                소개
              </Link>
            </li>
            <li className="policy-menu__item">
              <Link
                className="policy-menu__item-link"
                to="/docs/privacypolicy"
                onClick={() => setOpen(false)}
              >
                개인정보처리약관
              </Link>
            </li>
            <li className="policy-menu__item">
              <Link
                className="policy-menu__item-link"
                to="/docs/service"
                onClick={() => setOpen(false)}
              >
                이용약관
              </Link>
            </li>
          </ul>
        </li>
        <li className="policy-nav__item policy-nav__item--action">
          <button
            type="button"
            className="policy-nav__action-button"
            onClick={() => window.print()}
            aria-label="인쇄"
          >
            <span className="material-symbols-outlined">print</span>
          </button>
        </li>
        <li className="policy-nav__item policy-nav__item--action">
          <button
            type="button"
            className="policy-nav__action-button"
            onClick={() => handleCopyClipBoard(`${url}${location.pathname}`)}
            aria-label="링크 공유"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigator;
