import { Navigate, useNavigate } from "react-router-dom";
import "../../Pages/Login.css";

declare global {
  interface Window {
    Kakao: any;
  }
}

const KakaoLogin = () => {
  const navigate = useNavigate();
  const { Kakao } = window;
  const searchParams = new URLSearchParams(document.location.search);
  const code = searchParams.get("code");

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.REACT_APP_KAKAO_API_KEY);
  }

  const getUserData = async () => {
    try {
      let data = await Kakao.API.request({
        url: "/v2/user/me",
      });
      console.log(data)
      // const properties = {
      //   uid: `kakao:${data.result.id}`,
      //   provider: 'Kakao.com',
      //   displayName: data.result.properties.nickname,
      //   email: data.result.kakao_account.email
      // }
      

      navigate('/');
    } catch (err) {
      console.log("here?");
      console.log(err);
    }
  };

  const getAccessToken = async () => {
    console.log(code);
    const response = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: `grant_type=authorization_code&client_id=5285b2efa74367ac451af3041c4291cd&redirect_uri=http://localhost:3000/login/oauth&code=${code}`,
    });

    try {
      const data = await response.json();
      console.log(data);
      Kakao.Auth.setAccessToken(data.access_token);
      const userData = Kakao.API.request({ url: "/v2/user/me" });
      console.log(userData);
      getUserData();
    } catch (err) {
      alert(err);
      console.log(err);
      navigate('/login');
    }
  };

  const kakaoLoginHandler = () => {
    Kakao.Auth.authorize({
      redirectUri: process.env.REACT_APP_REDIRECT_URL,
      scope: "profile_nickname account_email",
    });
  };

  if (code) {
    getAccessToken();
  }

  return (
    <div className="Social-Login Kakao" onClick={kakaoLoginHandler}>
      <img
        src="/images/kakao.png"
        alt="카카오 로그인 버튼"
      />
      <span>카카오톡 로그인</span>
    </div>
  );
};

export default KakaoLogin;
