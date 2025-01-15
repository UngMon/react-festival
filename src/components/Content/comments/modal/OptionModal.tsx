import { useEffect, useRef, useState } from "react";
import { Comment, UserData } from "../../../../type/UserDataType";
import { useAppDispatch } from "../../../../redux/store";
import { modalActions } from "../../../../redux/modal-slice";
import { reportActions } from "../../../../redux/report-slice";
import "./OptionModal.css";

interface T {
  comment_data: Comment;
  userData: UserData;
}

const OptionModal = ({ comment_data, userData }: T) => {
  const [scrollY, setScrollY] = useState<number>(window.scrollY);
  const reff = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { user_id, createdAt } = comment_data;

  useEffect(() => {
    const toggleOptionModal = (e: MouseEvent) => {
      if (!reff.current?.contains(e.target as Node)) {
        setScrollY(0);
        dispatch(
          modalActions.clearModalInfo({
            comment_id: comment_data.createdAt + comment_data.user_id,
          })
        );
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
  }, [dispatch, comment_data, scrollY]);

  const clickHandler = (type: string) => {
    if (userData.user_id === "")
      return alert(`로그인 하시면 이용하실 수 있습니다.`);

    const comment_id: string = createdAt + user_id;

    switch (true) {
      case type === "revise":
        dispatch(modalActions.clickReviseButton({ comment_id }));
        break;
      case type === "delete":
        dispatch(modalActions.openDeleteModal({ comment_id }));
        break;
      default:
        dispatch(reportActions.setReport({ comment_data, userData }));
    }
  };

  return (
    <div className="option-box" ref={reff}>
      {user_id === userData.user_id ? (
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
