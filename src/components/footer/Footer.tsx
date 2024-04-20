import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-box">
      <div className="footer">
        <p>@정보제공</p>
        <div>
          <a
            href="https://api.visitkorea.or.kr/#/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/images/tourapi-logo.png" alt="logo" />
          </a>
        </div>
        <div>
          <a
            href="https://api.visitkorea.or.kr/#/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/images/logo_foot_gg.png" alt="logo" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
