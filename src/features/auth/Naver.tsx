import { redirectNaverLogin } from "utils/login_utils";
import naver_logo from '../../assets/login/naver_logo.png';

interface T {
  setLoading: (bool: boolean) => void;
}

const Naver = ({ setLoading }: T) => {
  const clickHandler = () => {
    const naver_btn = redirectNaverLogin();
    if (naver_btn) {
      naver_btn.click();
      setLoading(true);
    } else {
      alert("네이버 로그인 버튼이 존재하지 않습니다.");
    }
  };

  return (
    <>
      <button className={'login-button Naver'} onClick={clickHandler}>
        <img src={naver_logo} alt="네이버 아이콘" />
        <span>네이버 로그인</span>
      </button>
    </>
  );
};

export default Naver;
