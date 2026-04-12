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
import "./Account.css";

const Provider_List: Record<string, string[]> = {
  "google.com": ["Google", goolge_logo],
  "facebook.com": ["Facebook", facebook_logo],
  "kakao.com": ["Kakao", kakao_logo],
  "naver.com": ["Naver", naver_logo],
};

const Account = () => {
  const { user, provider, logout } = useAuth();
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
    <div className="account">
      <div className="account-wrapper">
        <section className="account__photo-section">
          <div className="account__photo-description">
            <span>나의 계정</span>
            <br></br>
            <span>프로필 이미지와 닉네임을 관리해 보세요.</span>
          </div>
          <div className="account__photo-container">
            <img
              alt="프로필 이미지"
              className="account__photo-img"
              src={photoURL || "./images/userIcon.png"}
              onClick={() => setOpenImageEditor(true)}
            />
            <button
              className="account__photo-edit-btn"
              onClick={() => setOpenImageEditor(true)}
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
          </div>
        </section>

        <section className="account__info-section">
          <div className="account__info-row account__info-row--flex">
            <div className="nickname-box account__info-text">
              <h3>닉네임</h3>
              <span>{displayName || "-"}</span>
            </div>
            <button
              type="button"
              className="account__btn"
              onClick={() => setOpenEditName(true)}
            >
              {"수정하기"}
            </button>
          </div>
          <div className="account__info-row account__info-text">
            <h3>이메일</h3>
            <span>{email || "-"}</span>
          </div>
          <div className="sign-up-date account__info-row account__info-text">
            <h3>가입일</h3>
            <span>{formatDate(auth?.currentUser?.metadata.creationTime)}</span>
          </div>
        </section>

        <section className="account__platform-section">
          <h3 className="account__platform-title">소셜 플랫폼</h3>
          <p className="account__platform-desc">
            가입하신 소셜 플랫폼을 확인할 수 있습니다.
          </p>
          <div className="account__platform-list">
            {Object.entries(Provider_List).map((item) => (
              <div
                key={item[0]}
                className="account__info-row account__info-row--flex"
              >
                <div className="account__platform-icon">
                  <img src={item[1][1]} alt={item[1][0]} width={40} />
                  <span>{item[1][0]}</span>
                </div>
                <span
                  className={`account__btn no-hover ${provider === item[0] ? "plat-check" : ""}`}
                >
                  {provider === item[0] ? "연동됨" : "연동안됨"}
                </span>
              </div>
            ))}
          </div>
          <div className="account__platform-summary">
            <span>{`${Provider_List[provider!][0]}(으)로 로그인 한 계정입니다.`}</span>
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
    </div>
  );
};

export default Account;
