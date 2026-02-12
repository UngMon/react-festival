import { UserData } from "types/UserDataType";
import { useState } from "react";
import { auth } from "../../firebase";
import Portal from "../../common/Portal";
import EditProfileImage from "./edit/EditProfileImage";
import EditProfileName from "./edit/EditProfileName";
import DeleteAccount from "./edit/DeleteAccount";
import "./UserInfo.css";

interface T {
  userData: UserData;
}

const UserInfo = ({ userData }: T) => {
  const { current_user_email, current_user_name, current_user_photo } =
    userData;

  const [openImageEditor, setOpenImageEditor] = useState<boolean>(false);
  const [openEditName, setOpenEditName] = useState<boolean>(false);
  const [openDeleteAcc, setOpenDeleteAcc] = useState<boolean>(false);

  const provider: string = auth?.currentUser?.providerData[0].providerId || "";

  const formantDate = (date: string | undefined) => {
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
      <header className="profile-header">
        <h2>
          <span className="material-symbols-outlined">account_box</span>
          <span className="material-symbols-outlined">arrow_forward_ios</span>
          개인정보관리
        </h2>
        <p>닉네임과 프로필 사진을 변경할 수 있습니다.</p>
      </header>
      <section className="profile-photo-box">
        <div className="profile-photo">
          <img
            src={current_user_photo || "./images/userIcon.png"}
            alt="프로필 이미지"
          />
          <button
            className="edit-photo-button"
            onClick={() => setOpenImageEditor(true)}
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
        <div className="photo-description">
          <span>{current_user_name}</span>
        </div>
      </section>
      <section className="profile-detail-section">
        <div className="pr-list-box pr-dis-flex">
          <div className="nickname-box pr-text-box">
            <h3>닉네임</h3>
            <span>{current_user_name || "-"}</span>
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
          <span>{current_user_email || "-"}</span>
        </div>
        <div className="sign-up-date pr-list-box pr-text-box">
          <h3>가입일</h3>
          <span>{formantDate(auth?.currentUser?.metadata.creationTime)}</span>
        </div>
      </section>
      <section className="profile-platform-section">
        <h3 className="profile-title">소셜 플랫폼</h3>
        <p>가입하신 소셜 플랫폼을 확인할 수 있습니다.</p>
        <div className="platforms-container">
          <div className="pr-list-box pr-dis-flex">
            <div className="plat-icon">
              <img src="./images/google_logo.jpeg" alt="google" width={40} />
              <span>Google</span>
            </div>
            <span className="pr-button plat-check">
              {provider === "google.com" ? "연결됨" : "연결안됨"}
            </span>
          </div>
          <div className="pr-list-box pr-dis-flex">
            <div className="plat-icon">
              <img src="./images/facebook_logo.png" alt="facebook" width={40} />
              <span>Facebook</span>
            </div>
            <span className="pr-button plat-check">
              {provider === "facebook.com" ? "연결됨" : "연결안됨"}
            </span>
          </div>
          <div className="pr-list-box pr-dis-flex">
            <div className="plat-icon">
              <img src="./images/kakao_logo.png" alt="kakao" width={40} />
              <span>Kakao</span>
            </div>
            <span className="pr-button plat-check">
              {provider === "Kakao" ? "연결됨" : "연결안됨"}
            </span>
          </div>
          <div className="pr-list-box pr-dis-flex">
            <div className="plat-icon">
              <img src="./images/naver_logo.png" alt="naver" width={40} />
              <span>Naver</span>
            </div>
            <span className="pr-button plat-check">
              {provider === "Naver" ? "연결됨" : "연결안됨"}
            </span>
          </div>
        </div>
        <div className="plat-sub">
          <span>{`네이버(으)로 로그인 한 계정입니다.`}</span>
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
              nickName={current_user_name}
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
          children={<DeleteAccount setOpenDeleteAcc={setOpenDeleteAcc} />}
        />
      )}
    </div>
  );
};

export default UserInfo;
