import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-box">
      <div className="footer">
        <p>제작:&nbsp;박완웅</p>
        <p>연락처:&nbsp;ungmorning9@gmail.com</p>
        <div className="f-3">
          <p>@정보제공</p>
          <a
            href="https://api.visitkorea.or.kr/#/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/images/tourapi-logo.png" width="100" alt="logo" />
          </a>
          <a
            href="https://api.visitkorea.or.kr/#/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/images/logo_foot_gg.png" width="100" alt="logo" />
          </a>
        </div>

        <div></div>
      </div>
    </footer>
  );
};

export default Footer;
