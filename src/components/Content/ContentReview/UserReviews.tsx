import { useState, useRef, useEffect } from "react";
import {
  DocumentData,
  DocumentReference,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { nowDate } from "../../../utils/NowDate";
import { FirebaseState } from "../../../type/Firebase";
import { Comment } from "../../../type/UserData";
import { useAppDispatch } from "../../../redux/store";
import { firebaseActions } from "../../../redux/firebase-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../../../firebase";
import { Link } from "react-router-dom";
import { Report } from "../../../type/Firebase";
import DeleteModal from "./modal/DeleteModal";
import "./UserReviews.css";

interface ReviewProps {
  firebaseState: FirebaseState;
  contentRef: DocumentReference<DocumentData>;
  contentId: string;
  setReportModal:  React.Dispatch<React.SetStateAction<Report>>;
}

const UserReviews = ({
  firebaseState,
  contentRef,
  contentId,
  setReportModal,
}: ReviewProps) => {
  const dispatch = useAppDispatch();

  const [option, setOption] = useState<{ isVisible: boolean; index: number }>({
    isVisible: false,
    index: -100,
  });
  const [reviseReview, setReviseReview] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);
  const [openDelete, setOpenDelete] = useState<[boolean, number]>([false, 0]);
  const [reviewArray, setReviewArray] = useState<Comment[]>([]);
  const [openOption, setOpenOption] = useState<boolean>(false);
  const [pickedCommentInfo, setPickedCommentInfo] = useState<{
    userName: string;
    userUid: string;
    when: string;
    index: number;
  }>({ userName: "", userUid: "", when: "", index: -100 });

  const textRef = useRef<HTMLTextAreaElement>(null);
  const saveInputRef = useRef<HTMLInputElement>(null);
  const optionRef = useRef<{ [key: string]: SVGSVGElement | null }>({});
  const clickedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (firebaseState.succesGetContentData) {
      setReviewArray(firebaseState.contentData[contentId].comment);
      console.log("RE New User Reviews");
    }
  }, [firebaseState, contentId]);

  useEffect(() => {
    if (!openOption) return;

    const toggleOptionModal = (e: MouseEvent) => {
      if (!optionRef.current[option.index]?.contains(e.target as Node)) {
        clickedElement.current = null;
        setOpenOption(false);
        setOption({ isVisible: false, index: -100 });
        setScrollY(0);
      }
    };

    const scrollHandler = () => window.scrollTo(0, scrollY);

    window.addEventListener("click", toggleOptionModal);
    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("click", toggleOptionModal);
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [openOption, scrollY, option]);

  const reivewSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const User = auth.currentUser;

    if (!User?.displayName || !User?.uid)
      return alert("비정상적인 접근입니다.");

    const text = textRef.current!.value;

    if (text.length === 0) return alert("글자를 입력해주세요!");

    const { year, month, date, time } = nowDate();

    const fieldData = {
      name: User.displayName,
      uid: User.uid,
      when: year + "-" + month + "-" + date + "/" + time,
      text,
      userPhoto: User.photoURL ?? "",
    };

    const array = [fieldData, ...reviewArray];

    try {
      await setDoc(contentRef, { comment: array }, { merge: true });
      setReviewArray(array);
      dispatch(firebaseActions.updateReviewData({ contentId, array }));
    } catch (error: any) {
      alert(
        `리뷰 작성에 에러가 발생했습니다! ${error.message} 에러가 계속 발생한다면 문의해 주세요!`
      );
    }

    textRef.current!.value = "";
  };

  const optionClickHandler = (
    e: React.MouseEvent,
    userName: string,
    userUid: string,
    when: string
  ) => {
    e.stopPropagation();

    if (clickedElement.current?.contains(e.target as Node)) {
      // 사용자가 전에 클릭했던 Element('review-option')와 같은 옵션 아이콘을 클릭했을 시,
      setOpenOption(false);
      clickedElement.current = null;
      setPickedCommentInfo({
        userName: "",
        userUid: "",
        when: "",
        index: -100,
      });
    } else {
      // 다른 태그('review-option')를 클릭했을 시,
      setOpenOption(true);
      clickedElement.current = e.target as HTMLDivElement;
      setPickedCommentInfo({ userName, userUid, when, index: -100 });
    }
  };

  const reviseButtonHandler = (itemUid: string, index: number) => {
    if (itemUid !== auth.currentUser!.uid) return;

    setOpenOption(false);
    setReviseReview(true);
    setPickedCommentInfo({
      userName: pickedCommentInfo.userName,
      userUid: pickedCommentInfo.userUid,
      when: pickedCommentInfo.when,
      index,
    });
  };

  const reviseReviewHandler = async () => {
    const { year, month, date, time } = nowDate();
    let newArray = [...reviewArray];
    const index: number = pickedCommentInfo.index;
    newArray.splice(index, 1);
    const changedData = {
      name: pickedCommentInfo.userName,
      text: saveInputRef.current!.value,
      uid: pickedCommentInfo.userUid,
      when: year + "-" + month + "-" + date + " " + time,
      userPhoto: auth.currentUser?.photoURL || "",
    };

    newArray = [changedData, ...newArray];

    setPickedCommentInfo({ userName: "", userUid: "", when: "", index: -100 });
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
    setReportModal({ open: true, when, userUid, name, text });
  };

  const resizeHandler = () => {
    textRef.current!.style.height = "auto"; // heigth 초기화
    textRef.current!.style.height = textRef.current?.scrollHeight + "px";
  };

  return (
    <div>
      <form className="comment-input-box" onSubmit={reivewSubmitHandler}>
        <div className="comment-text-box">
          <label htmlFor="user-input" />
          <textarea
            id="user-input"
            name="user-input"
            rows={2}
            ref={textRef}
            onChange={resizeHandler}
            placeholder="소중한 리뷰를 작성해보세요!"
          />
          <i />
        </div>
        <div className="comment-button-box">
          {!auth.currentUser && (
            <button type="button">
              <Link to="/login">로그인</Link>
            </button>
          )}
          {auth.currentUser && <button type="submit">저장</button>}
        </div>
      </form>
      <div className="user-comments">
        {reviewArray.length === 0 && <p>등록된 리뷰가 없습니다!</p>}
        {reviewArray.length !== 0 &&
          reviewArray.map((item, index) => (
            <div
              key={index}
              className="user-comment-box"
              onMouseEnter={() =>
                !openOption && setOption({ isVisible: true, index })
              }
              onMouseLeave={() =>
                !openOption && setOption({ isVisible: false, index: -100 })
              }
            >
              <div className="user-icon">
                {item.userPhoto.length !== 0 && (
                  <img src={`${item.userPhoto}`} alt="userPhoto" />
                )}
                {item.userPhoto.length === 0 && item.name.length !== 0 && (
                  <p>{item.name[0].toUpperCase()}</p>
                )}
              </div>
              {pickedCommentInfo.index !== index && (
                <div className="top">
                  <span className="name">{item.name}</span>
                  {option.isVisible && index === option.index && (
                    <FontAwesomeIcon
                      className="comment-option"
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
                      icon={faEllipsisVertical}
                    />
                  )}
                  {openOption &&
                    item.uid === pickedCommentInfo.userUid &&
                    item.when === pickedCommentInfo.when && (
                      <div className="option-box">
                        {item.uid === auth.currentUser?.uid && (
                          <p
                            className="option-revise"
                            onClick={() => reviseButtonHandler(item.uid, index)}
                          >
                            수정
                          </p>
                        )}
                        {item.uid === auth.currentUser?.uid && (
                          <p
                            className="option-delete"
                            onClick={() => setOpenDelete([true, index])}
                          >
                            삭제
                          </p>
                        )}
                        {item.uid !== auth.currentUser?.uid && (
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
              )}
              {pickedCommentInfo.index !== index && (
                <div className="comment-text">
                  <p>{item.text}</p>
                </div>
              )}
              {index === pickedCommentInfo.index && reviseReview && (
                <>
                  <div className="revise-input-box">
                    <input placeholder={item.text} ref={saveInputRef}></input>
                    <i />
                  </div>
                  <div className="revise-button-box">
                    <button
                      onClick={() => {
                        setPickedCommentInfo({
                          userName: "",
                          userUid: "",
                          when: "",
                          index: -100,
                        });
                        setReviseReview(false);
                      }}
                    >
                      취소
                    </button>
                    <button onClick={reviseReviewHandler}>저장</button>
                  </div>
                </>
              )}
            </div>
          ))}
        {openDelete[0] && (
          <DeleteModal
            contentRef={contentRef}
            reviewArray={reviewArray}
            setReviewArray={setReviewArray}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
          />
        )}
      </div>
    </div>
  );
};

export default UserReviews;
