import React, { useEffect, useRef } from "react";
import { Comment, Report, PickComment } from "../../../../type/UserDataType";
import "./OptionModal.css";

interface T {
  item: Comment;
  userUid: string;
  scrollY: number;
  setScrollY: React.Dispatch<React.SetStateAction<number>>;
  // setReviseReview: React.Dispatch<React.SetStateAction<boolean>>;
  setReportModal: React.Dispatch<React.SetStateAction<Report>>;
  setPickedComment: React.Dispatch<React.SetStateAction<PickComment>>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
}

const OptionModal = ({
  item,
  userUid,
  scrollY,
  setScrollY,
  // setReviseReview,
  setReportModal,
  setPickedComment,
  clickedElement,
}: T) => {
  const reff = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toggleOptionModal = (e: MouseEvent) => {
      if (!reff.current?.contains(e.target as Node)) {
        console.log("??????");
        clickedElement.current = null;
        // setOpenOption(false);
        setScrollY(0);
        setPickedComment((prevState) => ({ ...prevState, open: "" }));
      }
    };

    const scrollHandler = () => window.scrollTo(0, scrollY);

    window.addEventListener("click", toggleOptionModal);
    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("click", toggleOptionModal);
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [
    item,
    setPickedComment,
    // setOpenOption,
    scrollY,
    setScrollY,
    clickedElement,
  ]);

  const clickHandler = (type: string) => {
    switch (true) {
      case type === "revise":
        // setReviseReview(true);
        setPickedComment((prevState) => ({
          ...prevState,
          [`${item.createdAt}${item.uid}`]: "revise",
          open: "",
        }));
        break;
      case type === "delete":
        setPickedComment((prevState) => ({
          ...prevState,
          [`${item.createdAt}${item.uid}`]: "delete",
          open: "",
        }));
        break;
      default:
        setReportModal({
          open: true,
          when: item.createdAt,
          userUid: item.uid,
          name: item.name,
          text: item.createdAt,
        });
    }
    // setOpenOption(false);
    clickedElement.current = null;
  };

  return (
    <div className="option-box" ref={reff}>
      {item.uid === userUid ? (
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
