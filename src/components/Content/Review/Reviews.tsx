import { useState, useRef, useEffect, useCallback } from "react";
import {
  DocumentData,
  DocumentReference,
  setDoc,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import { nowDate } from "../../../modules/NowData";
import { firebaseState, Comment } from "../../../modules/Type";
import Loading from "../../UI/Loading";

interface ReviewProps {
  firebaseState: firebaseState;
  contentRef: DocumentReference<DocumentData>;
  uid: string;
  contentId: string;
}

const Reviews = ({
  firebaseState,
  contentRef,
  uid,
  contentId,
}: ReviewProps) => {
  console.log("render");
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
  const optionRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (firebaseState.succesGetData) {
      console.log(firebaseState.contentData[contentId])
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

  const reivewSubmitHandler = (event: React.FormEvent) => {
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
    };

    const array = [fieldData, ...reviewArray];

    setDoc(contentRef, { comment: array }, { merge: true });
    setReviewArray(array);
    inputRef.current!.value = "";
  };

  const optionClickHandler = (
    event: any,
    userName: string,
    userUid: string,
    userWhen: string
  ) => {
    if (userUid !== uid) {
      return;
    }

    if (clickedElement === event.target) {
      // 사용자가 전에 클릭했던 Element('review-option')가 같은 태그를 클릭했을 시,
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

  const reviseButtonHandler = (itemUid: string,index: number) => {
    if (!firebaseState.loginedUser) {
      return alert('로그인 하시면 이용하실 수 있습니다.');
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

  const deleteReviewHandler = (index: number) => {
    updateDoc(contentRef, { comment: arrayRemove(reviewArray[index]) });
    setReviewArray([
      ...reviewArray.slice(0, index),
      ...reviewArray.slice(index + 1),
    ]);
  };

  const reviseReviewHandler = () => {
    const { year, month, date, time } = nowDate();
    const newArray = [...reviewArray];
    const index = pickedComment[3] as number;
    const changedData = {
      name: pickedComment[0],
      text: saveInputRef.current!.value,
      uid: pickedComment[1],
      when: year + "-" + month + "-" + date + " " + time,
    };
    newArray[index] = changedData;
    updateDoc(contentRef, { comment: newArray });
    setReviewArray(newArray);
    setPickedComment(['', '', '', ''])
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
        {!firebaseState.succesGetData ? (
          <Loading />
        ) : reviewArray.length !== 0 ? (
          reviewArray.map((item, index) => (
            <div key={index} className="user-review-box">
              <div className="user-icon">
                <p>{item.name[0].toUpperCase()}</p>
              </div>

              {index !== pickedComment[3] && (
                <>
                  <div className="user-reivew-top">
                    <div className="user-name">{item.name}</div>
                    <div
                      className="review-option"
                      onClick={(event) =>
                        optionClickHandler(
                          event,
                          item.name,
                          item.uid,
                          item.when
                        )
                      }
                      ref={(el: HTMLDivElement) =>
                        (optionRef.current[`${index}`] = el)
                      }
                    >
                      옵션
                    </div>
                    {isOpenOption &&
                      item.uid === pickedComment[1] &&
                      item.when === pickedComment[2] && (
                        <div className="option-box">
                          <p
                            className="option-revise"
                            onClick={() => reviseButtonHandler(item.uid, index)}
                          >
                            수정
                          </p>
                          <p
                            className="option-delete"
                            onClick={() => deleteReviewHandler(index)}
                          >
                            삭제
                          </p>
                        </div>
                      )}
                  </div>
                  <div className="review-text">{item.text}</div>
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
          ))
        ) : (
          <div>
            <p>등록된 리뷰가 없습니다!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Reviews;
