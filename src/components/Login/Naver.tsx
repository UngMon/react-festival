import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { auth as firebaseAuth } from "../../firebase";
import { signInWithCustomToken } from "firebase/auth";

declare global {
  interface Window {
    naver: any;
  }
}

interface Auth {
  firebaseToken: string;
}

const Naver = () => {
  console.log("naver");
  const navigate = useNavigate();

  const naverLoginHandler = async () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: "fiHWjnAxOEA6vStuEFcP",
      callbackUrl: "http://localhost:3000/login/oauth",
      isPopup: false,
      loginButton: { color: "white", type: 3, height: "47" },
    });
    naverLogin.init();
    console.log(naverLogin);
 
    const token = naverLogin.accessToken.accessToken || "";

    try {
      const res: AxiosResponse<Auth> = await axios.post(
        "http://127.0.0.1:5001/festival-5a61a/asia-northeast3/auth/naver",
        { token, withCredentials: true }
      );

      const { firebaseToken } = res.data;

      await signInWithCustomToken(firebaseAuth, firebaseToken);

      const currentUrl = sessionStorage.getItem("currentUrl");

      if (currentUrl) {
        navigate(-2);
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    naverLoginHandler();

  });

  return <div id="naverIdLogin" />;
};

export default Naver;
