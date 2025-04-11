import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const moveScreenTop = () => {
    window.scroll({ top: 0 });
  };

  return (
    <footer className="footer-container">
      <div className="footer-logo">
        <p>여기저기</p>
      </div>
      <div className="footer-navigation">
        <nav>
          <ul>
            <li onClick={moveScreenTop}>
              <Link to="/etc/about">About</Link>
            </li>
            <li onClick={moveScreenTop}>
              <Link to="/etc/privacypolicy">개인정보처리약관</Link>
            </li>
            <li onClick={moveScreenTop}>
              <Link to="/etc/service">이용약관</Link>
            </li>
            <li>
              <Link
                to="https://knto.or.kr/helpdeskCopyrightguide"
                target="_blank"
                rel="noreferrer"
              >
                저작권보호정책
              </Link>
            </li>
            <li onClick={moveScreenTop}>
              <Link to="/etc/question">Q&A</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="footer-line"></div>
      <div className="footer-copyright">
        <div className="copyright">ⓒ한국관광공사</div>
        <div className="copyright-icons">
          <Link to="https://knto.or.kr" target="_blank" rel="noreferrer">
            <img src="/images/logo_kto.svg" alt="한국관광공사" />
          </Link>
          <Link
            to="https://api.visitkorea.or.kr"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/images/tourapi-logo.png" alt="TOURAPI" width={100} />
          </Link>
          <Link
            to="https://visitkoreayear.kr/enu/index.kto"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/images/visit_kto.svg" alt="VISITKOREA" width={80} />
          </Link>
          <Link
            to="https://phoko.visitkorea.or.kr/main/index.kto"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/images/photo_gallery_black_PC.png"
              alt="한국관광공사포토갤러리"
              width={120}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
