import { useAuth } from "context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "store/store";
import { modalActions } from "store/modal-slice";
import "./OptionModal.css";

interface T {
  comment_id: string;
  comment_user_id: string;
}

const OptionModal = ({ comment_id, comment_user_id }: T) => {
  const [scrollY, setScrollY] = useState<number>(window.scrollY);
  const boxRef = useRef<HTMLDivElement>(null);
  const current_user_id = useAuth().user?.uid;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const toggleOptionModal = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) {
        setScrollY(0);
        dispatch(modalActions.toggleToastModal({ comment_id }));
      }
    };

    const preventScroll = (e: Event) => {
      e.preventDefault();
      window.scrollTo(0, scrollY);
      
    };

    window.addEventListener("click", toggleOptionModal);
    window.addEventListener("scroll", preventScroll, { passive: false });
    window.addEventListener("wheel", preventScroll, { passive: false }); // 마우스 휠 방지
    window.addEventListener("touchmove", preventScroll, { passive: false }); // 모바일 터치 스크롤 방지

    return () => {
      window.removeEventListener("click", toggleOptionModal);
      window.removeEventListener("scroll", preventScroll);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      
    };
  }, [dispatch, scrollY, comment_id]);

  const clickHandler = (type: string) => {
    if (!current_user_id) return alert(`로그인 하시면 이용하실 수 있습니다.`);

    if (type === "revise")
      dispatch(modalActions.clickReviseButton({ comment_id }));
    else if (type === "delete")
      dispatch(modalActions.openDeleteModal({ comment_id }));
    else if (type === "report")
      dispatch(modalActions.openReportModal({ comment_id }));
  };

  return (
    <div className="option-box" ref={boxRef}>
      {comment_user_id === current_user_id ? (
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
