import { Link } from "react-router-dom";
import kto_logo from "../../assets/footer/kto-logo.svg";
import photo_gallery from "../../assets/footer/photo-gallery-logo.png";
import tourapi_logo from "../../assets/footer/tourapi-logo.png";
import visi_logo from "../../assets/footer/visit-kto.svg";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-logo">
        <p>이곳저곳</p>
      </div>
      <div className="footer-navigation">
        <nav>
          <ul>
            <li>
              <Link to="/docs/about">소개</Link>
            </li>
            <li>
              <Link to="/docs/privacypolicy">개인정보처리약관</Link>
            </li>
            <li>
              <Link to="/docs/service">이용약관</Link>
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
            <li>
              <Link to="/question">Q&A</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="footer-line"></div>
      <div className="footer-copyright">
        <div className="copyright">ⓒ한국관광공사</div>
        <div className="copyright-icons">
          <Link to="https://knto.or.kr" target="_blank" rel="noreferrer">
            <img src={kto_logo} alt="한국관광공사" />
          </Link>
          <Link
            to="https://api.visitkorea.or.kr"
            target="_blank"
            rel="noreferrer"
          >
            <img src={tourapi_logo} alt="TOURAPI" width={100} />
          </Link>
          <Link
            to="https://visitkoreayear.kr/enu/index.kto"
            target="_blank"
            rel="noreferrer"
          >
            <img src={visi_logo} alt="VISITKOREA" width={80} />
          </Link>
          <Link
            to="https://phoko.visitkorea.or.kr/main/index.kto"
            target="_blank"
            rel="noreferrer"
          >
            <img src={photo_gallery} alt="한국관광공사포토갤러리" width={120} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
