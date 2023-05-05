import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-box">
      <p>제작자: &nbsp;박완웅</p>
      <p>개인정보담당자: &nbsp;박완웅</p>
      <p>주소: &nbsp;하늘을 지붕 삼은 곳</p>
      <p>contact: &nbsp;ungmorning9@gmail.com</p>
      <p>
        사진 및 정보: &nbsp;
        <a href="https://api.visitkorea.or.kr/#/">한국관광공사</a>
      </p>
      <p>
        배경화면:
        <a href="https://www.pexels.com/ko-kr/">
          &nbsp;&nbsp;https://www.pexels.com/ko-kr/
        </a>
      </p>
      <p>지도: &nbsp;카카오 맵</p>
    </footer>
  );
};

export default Footer;
