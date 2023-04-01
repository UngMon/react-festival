import { useState, useRef, useEffect } from "react";
import { DocumentData, DocumentReference, setDoc, updateDoc, deleteField, arrayRemove } from "firebase/firestore";
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
  const [isVisibleOption, setIsVisibleOption] = useState<boolean>(false);
  const [pickedComment, setPickedComment] = useState<
    [string, string, string | number]
  >(["", "", ""]);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (firebaseState.succesGetData) {
      setReviewArray(firebaseState.contentData[contentId].comment);
    }
  }, [firebaseState, contentId]);

  const reviewInputHandler = (event: React.FormEvent) => {
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
  };

  const optionClickHandler = (
    itemUid: string,
    itemWhen: string,
  ) => {
    if (itemUid !== uid) {
      return;
    }
    setIsVisibleOption((prevState) => !prevState);
    setPickedComment([itemUid, itemWhen, ""]);
  };

  const reviseReviewHandler = (index: number) => {
    setIsVisibleOption(false);
    setPickedComment([pickedComment[0], pickedComment[1], index]);
  };

  const deleteReviewHandler = (index: number) => {
    let updateData: { [key: string]: any} = {};
    updateData[`comment[${index}]`] = arrayRemove();
    updateDoc(contentRef, updateData);
  };

  const cancelRevise = () => {
    setPickedComment(["", "", ""]);
  };
  console.log(pickedComment);
  return (
    <>
      <form className="user-input-box" onSubmit={reviewInputHandler}>
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

              {index !== pickedComment[2] && (
                <>
                  <div className="user-reivew-top">
                    <div className="user-name">{item.name}</div>
                    <div
                      className="review-option"
                      onClick={() =>
                        optionClickHandler(item.uid, item.when)
                      }
                    >
                      옵션
                    </div>
                    {isVisibleOption &&
                      item.uid === pickedComment[0] &&
                      item.when === pickedComment[1] && (
                        <div className="option-box">
                          <p
                            className="option-revise"
                            onClick={() => reviseReviewHandler(index)}
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
              {index === pickedComment[2] && (
                <>
                  <div className="revise-input">
                    <input placeholder={item.text}></input>
                  </div>
                  <div className="review-button-box">
                    <button onClick={cancelRevise}>취소</button>
                    <button>저장</button>
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
