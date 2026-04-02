import { useState } from "react";
import { auth } from "../../../firebase";
import { useAuth } from "context/AuthContext";
import goolge_logo from "assets/login/google_logo.jpeg";
import facebook_logo from "assets/login/facebook_logo.png";
import kakao_logo from "assets/login/kakao_logo.png";
import naver_logo from "assets/login/naver_logo.png";
import Portal from "../../../common/Portal";
import EditProfileImage from "../edit/image/EditProfileImage";
import EditProfileName from "../edit/name/EditProfileName";
import DeleteAccount from "../edit/delete/DeleteAccount";
import LoadingSpinnerTwo from "common/loading/LoadingSpinnerTwo";
import "./Account.css";

const Provider_Name: Record<string, string> = {
  "kakao.com": "카카오",
  "naver.com": "네이버",
  "google.com": "구글",
  "facebook.com": "페이스북",
};

const Account = () => {
  const { user, provider, logout, status } = useAuth();
  const { email, displayName, photoURL } = user!;

  const [openImageEditor, setOpenImageEditor] = useState<boolean>(false);
  const [openEditName, setOpenEditName] = useState<boolean>(false);
  const [openDeleteAcc, setOpenDeleteAcc] = useState<boolean>(false);

  const formatDate = (date: string | undefined) => {
    if (!date) return "-";

    const dateObj = new Date(date);

    // 한국어 형식으로 변환

    const kr_date = dateObj.toLocaleDateString("ko-kr", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return kr_date;
  };

  return (
    <div className="profile-container">
      <section className="profile-photo-box">
        <div className="profile-photo">
          <img
            alt="프로필 이미지"
            src={photoURL || "./images/userIcon.png"}
            onClick={() => setOpenImageEditor(true)}
          />
          <button
            className="edit-photo-button"
            onClick={() => setOpenImageEditor(true)}
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
        <div className="photo-description">
          <span>{displayName}</span>
        </div>
      </section>
      <section className="profile-detail-section">
        <div className="pr-list-box pr-dis-flex">
          <div className="nickname-box pr-text-box">
            <h3>닉네임</h3>
            <span>{displayName || "-"}</span>
          </div>
          <button
            type="button"
            className="pr-button"
            onClick={() => setOpenEditName(true)}
          >
            {"수정하기"}
          </button>
        </div>
        <div className="pr-list-box pr-text-box">
          <h3>이메일</h3>
          <span>{email || "-"}</span>
        </div>
        <div className="sign-up-date pr-list-box pr-text-box">
          <h3>가입일</h3>
          <span>{formatDate(auth?.currentUser?.metadata.creationTime)}</span>
        </div>
      </section>
      <section className="profile-platform-section">
        <h3 className="profile-title">소셜 플랫폼</h3>
        <p>가입하신 소셜 플랫폼을 확인할 수 있습니다.</p>
        <div className="platforms-container">
          <div className="pr-list-box pr-dis-flex">
            <div className="plat-icon">
              <img src={goolge_logo} alt="google" width={40} />
              <span>Google</span>
            </div>
            <span className="pr-button plat-check">
              {provider === "google.com" ? "연결됨" : "연결안됨"}
            </span>
          </div>
          <div className="pr-list-box pr-dis-flex">
            <div className="plat-icon">
              <img src={facebook_logo} alt="facebook" width={40} />
              <span>Facebook</span>
            </div>
            <span className="pr-button plat-check">
              {provider === "facebook.com" ? "연결됨" : "연결안됨"}
            </span>
          </div>
          <div className="pr-list-box pr-dis-flex">
            <div className="plat-icon">
              <img src={kakao_logo} alt="kakao" width={40} />
              <span>Kakao</span>
            </div>
            <span className="pr-button plat-check">
              {provider === "kakao.com" ? "연결됨" : "연결안됨"}
            </span>
          </div>
          <div className="pr-list-box pr-dis-flex">
            <div className="plat-icon">
              <img src={naver_logo} alt="naver" width={40} />
              <span>Naver</span>
            </div>
            <span className="pr-button plat-check">
              {provider === "naver.com" ? "연결됨" : "연결안됨"}
            </span>
          </div>
        </div>
        <div className="plat-sub">
          <span>{`${Provider_Name[provider!]}(으)로 로그인 한 계정입니다.`}</span>
        </div>
      </section>
      <section className="delete-account">
        <button type="button" onClick={() => setOpenDeleteAcc(true)}>
          회원탈퇴
        </button>
      </section>
      {openEditName && (
        <Portal
          children={
            <EditProfileName
              nickName={displayName!}
              setOpenEditName={setOpenEditName}
            />
          }
        />
      )}
      {openImageEditor && (
        <Portal
          children={
            <EditProfileImage setOpenImageEditor={setOpenImageEditor} />
          }
        />
      )}
      {openDeleteAcc && (
        <Portal
          children={
            <DeleteAccount
              setOpenDeleteAcc={setOpenDeleteAcc}
              provider={provider}
              logout={logout}
            />
          }
        />
      )}
    </div>
  );
};

export default Account;
