import { useAuth } from "context/AuthContext";
import { useEffect, useRef, useState } from "react";
import LoadingSpinnerTwo from "common/loading/LoadingSpinnerTwo";
import "./EditProfileName.css";

interface T {
  nickName: string;
  setOpenEditName: (value: boolean) => void;
}

const EditProfileName = ({ nickName, setOpenEditName }: T) => {
  const { user, updateName } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [allow, setAllow] = useState<boolean>(false);
  const [text, setText] = useState<string>(nickName);
  const [subText, setSubText] = useState<string>("다른 이름을 입력하세요!");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [inputRef]);

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenEditName(false);
    };

    window.addEventListener("keydown", keydownHandler);

    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [setOpenEditName]);

  const editUserName = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputRef.current?.value;

    if (!text) {
      alert("이름을 입력해주세요!");
      return;
    } else if (text === nickName) {
      alert("다른 이름으로 설정해주세요!");
      return;
    } else if (text.length < 2) {
      alert("두 글자 이상의 이름을 입력하세요!");
      return;
    } else if (text.length > 10) {
      alert("닉네임은 10글자 이하로 설정합니다.");
      return;
    }

    const newNickname: string = text;

    if (!user || !user?.uid) throw new Error("로그인이 필요합니다.");

    try {
      setLoading(true);

      // 1. 현재 사용자의 ID 토큰 받기
      const idToken = await user.getIdToken();
      const response = await fetch(
        `${process.env.REACT_APP_FIREBASE_SERVER_POINT}/update-nickname`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ newNickname }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "서버 요청 실패");
      }

      // 3. 클라이언트 로컬 상태 업데이트
      // (Auth 서버 정보는 바뀌었지만 클라이언트 앱의 user 객체는 reload가 필요!)
      await user.reload();
      updateName(newNickname);
      // dispatch(firebaseActions.updateUserName({ newNickname }));
      alert("닉네임 변경이 완료되었습니다.");
    } catch (error: any) {
      console.error("Endpoint 호출 중 오류:", error);
      alert("변경 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setOpenEditName(false);
    }
  };

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    let allowButton = false;
    let sub_text = "";

    if (newName === nickName) {
      sub_text = "다른 이름을 입력하세요.";
    } else if (newName.length < 2) {
      sub_text = "최소 두 글자 이상 입력해주세요.";
    } else if (newName.length > 10) {
      sub_text = "최대 10글자까지 입력할 수 있습니다.";
    } else {
      allowButton = true;
      sub_text = "";
    }

    setText(newName);
    setSubText(sub_text);
    setAllow(allowButton);
  };

  return (
    <form className="edit-name-container" onSubmit={(e) => editUserName(e)}>
      {loading ? (
        <div className="spinner-container">
          <LoadingSpinnerTwo width="50px" padding="10px" />
        </div>
      ) : (
        <>
          <h3>닉네임 변경</h3>
          <p>닉네임은 2~10글자 까지 가능합니다.</p>
          <input
            type="text"
            name="nickname"
            value={text}
            ref={inputRef}
            onChange={(e) => changeEventHandler(e)}
          />
          <div className="sub-descr">
            <span>{subText}</span>
            <span>{`${text.length} / 10`}</span>
          </div>
          <div className="e-n-buttons">
            <button type="button" onClick={() => setOpenEditName(false)}>
              취소
            </button>
            <button type="submit" disabled={!allow}>
              저장
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default EditProfileName;
