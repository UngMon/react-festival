import { useState, useRef, useEffect, useCallback } from "react";
import {
  DocumentData,
  DocumentReference,
  setDoc,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import { nowDate } from "../../../utils/NowDate";
import { FirebaseState } from "../../../type/Firebase";
import { Comment } from "../../../type/UserData";
import { useAppDispatch } from "../../../redux/store";
import { firebaseActions } from "../../../redux/firebase-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "./modal/DeleteModal";

interface ReviewProps {
  firebaseState: FirebaseState;
  contentRef: DocumentReference<DocumentData>;
  uid: string;
  contentId: string;
  setReportModalOpen: React.Dispatch<
    React.SetStateAction<[boolean, string, string, string, string]>
  >;
}

const UserReviews = ({
  firebaseState,
  contentRef,
  uid,
  contentId,
  setReportModalOpen,
}: ReviewProps) => {
  const dispatch = useAppDispatch();

  const [visibleOption, setVisibleOption] = useState<[boolean, number]>([
    false,
    0,
  ]);
  const [openDelete, setOpenDelete] = useState<[boolean, number]>([false, 0]);
  const [reviewArray, setReviewArray] = useState<Comment[]>([]);
  const [isOpenOption, setOpenOption] = useState<boolean>(false);
  const [clickedElement, setClickedElement] = useState<HTMLElement | null>(
    null
  );
  const [pickedComment, setPickedComment] = useState<
    [string, string, string, string | number]
  >(["", "", "", ""]);

  const inputRef = useRef<HTMLInputElement>(null);
  const saveInputRef = useRef<HTMLInputElement>(null);
  const optionRef = useRef<SVGSVGElement[]>([]);

  useEffect(() => {
    if (firebaseState.succesGetData) {
      setReviewArray(firebaseState.contentData[contentId].comment);
    }
  }, [firebaseState, contentId]);

  const closeOptionModal = useCallback((event: any) => {
    let isIn = false;

    for (const divItem of optionRef.current) {
      if (!divItem) {
        continue;
      }

      if (divItem.contains(event.target)) {
        isIn = true;
        break;
      } else {
        isIn = false;
      }
    }

    if (!isIn) {
      setClickedElement(null);
      setOpenOption(false);
      setVisibleOption([false, 0]);
    }
  }, []);

  useEffect(() => {
    if (isOpenOption) {
      // Option창이 켜져있을 경우, 사용자가 스크롤을 못하게 방지.
      document.body.style.cssText = "overflow: hidden";
    } else {
      document.body.style.cssText = "";
    }

    if (clickedElement) {
      window.addEventListener("click", closeOptionModal);
    }

    return () => {
      window.removeEventListener("click", closeOptionModal);
    };
  }, [isOpenOption, closeOptionModal, clickedElement]);

  const reivewSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!firebaseState.loginedUser)
      return alert("로그인 하시면 이용하실 수 있습니다.");

    const text = inputRef.current!.value;

    if (text.length === 0) {
      return alert("글자를 입력해주세요!");
    }
    const { year, month, date, time } = nowDate();

    const fieldData = {
      name: firebaseState.userName,
      uid: uid,
      when: year + "-" + month + "-" + date + " " + time,
      text,
      userPhoto: firebaseState.userPhoto,
    };

    const array = [fieldData, ...reviewArray];

    try {
      await setDoc(contentRef, { comment: array }, { merge: true });
      setReviewArray(array);
      dispatch(firebaseActions.updateReviewData({ contentId, array }));
      inputRef.current!.value = "";
    } catch (error: any) {
      alert(
        `리뷰 작성에 에러가 발생했습니다! ${error.message} 에러가 계속 발생한다면 문의해 주세요!`
      );
    }
  };

  const optionClickHandler = (
    event: any,
    userName: string,
    userUid: string,
    userWhen: string
  ) => {
    if (clickedElement?.contains(event.target)) {
      // 사용자가 전에 클릭했던 Element('review-option')와 같은 태그를 클릭했을 시,
      setOpenOption(false);
      setClickedElement(null);
      setPickedComment(["", "", "", ""]);
    } else {
      // 다른 태그('review-option')를 클릭했을 시,
      setOpenOption(true);
      setClickedElement(event.target);
      setPickedComment([userName, userUid, userWhen, ""]);
    }
  };

  const reviseButtonHandler = (itemUid: string, index: number) => {
    if (!firebaseState.loginedUser) {
      return alert("로그인 하시면 이용하실 수 있습니다.");
    }

    if (itemUid !== uid) {
      return;
    }

    setOpenOption(false);
    setPickedComment([
      pickedComment[0],
      pickedComment[1],
      pickedComment[2],
      index,
    ]);
  };

  const reviseReviewHandler = async () => {
    const { year, month, date, time } = nowDate();
    const newArray = [...reviewArray];
    const index = pickedComment[3] as number;
    const changedData = {
      name: pickedComment[0],
      text: saveInputRef.current!.value,
      uid: pickedComment[1],
      when: year + "-" + month + "-" + date + " " + time,
      userPhoto: firebaseState.userPhoto,
    };
    newArray[index] = changedData;
    setPickedComment(["", "", "", ""]);
    try {
      await updateDoc(contentRef, { comment: newArray });
      setReviewArray(newArray);
    } catch (error: any) {
      alert(
        `리뷰 수정에 에러가 발생했습니다! ${error.message} 에러가 에러가 계속 발생한다면 문의해주세요!`
      );
    }
  };

  const reportUserHandler = async (
    when: string,
    userUid: string,
    name: string,
    text: string
  ) => {
    setReportModalOpen([true, when, userUid, name, text]);
  };

  return (
    <>
      <form className="user-input-box" onSubmit={reivewSubmitHandler}>
        <input
          type="text"
          id="user-input"
          placeholder="여러분의 소중한 리뷰를 작성해주세요!"
          ref={inputRef}
        ></input>
        <button type="submit">입력</button>
      </form>
      <div className="user-review-area">
        {reviewArray.length === 0 && (
          <div>
            <p>등록된 리뷰가 없습니다!</p>
          </div>
        )}
        {reviewArray.length !== 0 &&
          reviewArray.map((item, index) => (
            <div
              key={index}
              className="user-review-box"
              onMouseEnter={() => setVisibleOption([true, index])}
              onMouseLeave={() => !isOpenOption && setVisibleOption([false, 0])}
            >
              <div className="user-icon">
                {item.userPhoto ? (
                  <img src={`${item.userPhoto}`} alt="userPhoto"></img>
                ) : (
                  <p>{item.name[0].toUpperCase()}</p>
                )}
              </div>
              {index !== pickedComment[3] && (
                <>
                  <div className="user-reivew-top">
                    <span className="user-name">{item.name}</span>
                    {visibleOption[0] && index === visibleOption[1] && (
                      <FontAwesomeIcon
                        className="review-option"
                        onClick={(event) =>
                          optionClickHandler(
                            event,
                            item.name,
                            item.uid,
                            item.when
                          )
                        }
                        ref={(el: SVGSVGElement) =>
                          (optionRef.current[`${index}`] = el)
                        }
                        icon={faGear}
                      />
                    )}
                    {isOpenOption &&
                      item.uid === pickedComment[1] &&
                      item.when === pickedComment[2] && (
                        <div className="option-box">
                          {item.uid === firebaseState.userUid && (
                            <p
                              className="option-revise"
                              onClick={() =>
                                reviseButtonHandler(item.uid, index)
                              }
                            >
                              수정
                            </p>
                          )}
                          {item.uid === firebaseState.userUid && (
                            <p
                              className="option-delete"
                              onClick={() => setOpenDelete([true, index])}
                            >
                              삭제
                            </p>
                          )}
                          {item.uid !== firebaseState.userUid && (
                            <p
                              onClick={() =>
                                reportUserHandler(
                                  item.when,
                                  item.uid,
                                  item.name,
                                  item.text
                                )
                              }
                            >
                              신고
                            </p>
                          )}
                        </div>
                      )}
                  </div>
                  <div className="review-text">{item.text}</div>
                  {openDelete[0] && (
                    <DeleteModal
                      contentRef={contentRef}
                      reviewArray={reviewArray}
                      setReviewArray={setReviewArray}
                      openDelete={openDelete}
                      setOpenDelete={setOpenDelete}
                    />
                  )}
                </>
              )}
              {index === pickedComment[3] && (
                <>
                  <div className="revise-input">
                    <input placeholder={item.text} ref={saveInputRef}></input>
                  </div>
                  <div className="review-button-box">
                    <button onClick={() => setPickedComment(["", "", "", ""])}>
                      취소
                    </button>
                    <button onClick={reviseReviewHandler}>저장</button>
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default UserReviews;
