import React, { useEffect, useRef, useState } from "react";
import { Comment, PickComment, UserData } from "../../../../type/UserDataType";
import { useAppDispatch } from "../../../../redux/store";
import { reportActions } from "../../../../redux/report-slice";
import "./OptionModal.css";

interface T {
  commentData: Comment;
  userData: UserData;
  setPickedComment: React.Dispatch<React.SetStateAction<PickComment>>;
}

const OptionModal = ({ commentData, userData, setPickedComment }: T) => {
  const [scrollY, setScrollY] = useState<number>(window.scrollY);
  const reff = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const toggleOptionModal = (e: MouseEvent) => {
      if (!reff.current?.contains(e.target as Node)) {
        setScrollY(0);
        setPickedComment((prevState) => ({
          ...prevState,
          openOption: "",
          commentData: null,
          commentId: "",
          index: -100,
        }));
      }
    };

    const scrollHandler = () => {
      window.scrollTo(0, scrollY);
    };

    window.addEventListener("click", toggleOptionModal);
    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("click", toggleOptionModal);
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [commentData, setPickedComment, scrollY]);

  const clickHandler = (type: string) => {
    if (userData.user_id === "")
      return alert(
        `로그인을 하시면 이용하실 수 있습니다. 
        만약 로그인을 했을 경우, 이러한 문제가 지속적으로 발생한다면 문의해주세요!`
      );

    const commentId: string = commentData.createdAt + commentData.user_id;

    switch (true) {
      case type === "revise":
        setPickedComment((prevState) => ({
          ...prevState,
          [commentId]: "revise",
          openOption: "",
        }));
        break;
      case type === "delete":
        setPickedComment((prevState) => ({
          ...prevState,
          [commentId]: "delete",
          openOption: "",
        }));
        break;
      default:
        dispatch(
          reportActions.setReport({
            ...commentData,
            reporter_id: userData.user_id,
            reporter_name: userData.user_name,
          })
        );
    }
  };

  return (
    <div className="option-box" ref={reff}>
      {commentData.user_id === userData.user_id ? (
        <>
          <p className="option-revise" onClick={() => clickHandler("revise")}>
            수정
          </p>
          <p className="option-delete" onClick={() => clickHandler("delete")}>
            삭제
          </p>
        </>
      ) : (
        <p onClick={() => clickHandler("report")}>신고</p>
      )}
    </div>
  );
};

export default OptionModal;
