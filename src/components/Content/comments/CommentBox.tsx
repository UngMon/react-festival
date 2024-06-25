import React, { useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { Comment, Report, UserData } from "../../../type/UserDataType";
import { nowDate } from "../../../utils/NowDate";
import { db } from "../../../firebase";
import {
  doc,
  writeBatch,
  serverTimestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  DocumentData,
  startAfter,
  Query,
} from "firebase/firestore";
import DeleteModal from "./modal/DeleteModal";
import OptionModal from "./modal/OptionModal";
import LoadingSpinnerTwo from "../../loading/LoadingSpinnerTwo";

interface T {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  collectionName: string;
  contentId: string;
  state: { loading: boolean };
  dispatch: (value: { type: "pending" | "fulfiled" | "reject" }) => void;
  userData: UserData;
  setReportModal: React.Dispatch<React.SetStateAction<Report>>;
}

const CommentBox = ({
  comments,
  setComments,
  collectionName,
  contentId,
  state,
  dispatch,
  userData,
  setReportModal,
}: T) => {
  const [pickedCommentInfo, setPickedCommentInfo] = useState<{
    userName: string;
    userUid: string;
    when: string;
    index: number;
  }>({ userName: "", userUid: "", when: "", index: -100 });
  const [reviseReview, setReviseReview] = useState<boolean>(false);
  const [openOption, setOpenOption] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);
  const [completeGetCommentsData, setCompleteGetCommentsData] =
    useState<boolean>(false);
  const [targetRef, intersecting, setIntersecting] =
    useIntersectionObserver(false);

  const optionRef = useRef<{ [key: string]: SVGSVGElement | null }>({});
  const clickedElement = useRef<HTMLDivElement | null>(null);
  const saveInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (completeGetCommentsData || !intersecting || state.loading) return;

    const commentRef = collection(db, collectionName, contentId, "comment");

    const getCommentData = async () => {
      dispatch({ type: "pending" });

      try {
        let querySnapshot: Query<DocumentData>;

        if (comments.length / 50 >= 1) {
          const nextDataInex = comments[comments.length - 1].createdAt;
          querySnapshot = query(
            commentRef,
            orderBy("createdAt", "desc"),
            startAfter(nextDataInex),
            limit(50)
          );
        } else {
          querySnapshot = query(
            commentRef,
            orderBy("createdAt", "desc"),
            limit(50)
          );
        }

        const data = await getDocs(querySnapshot);
        const newCommentsData = data.docs.map((docs) =>
          docs.data()
        ) as Comment[];

        if (newCommentsData.length > 0)
          setComments([...comments, ...newCommentsData]);

        if (newCommentsData.length < 50) setCompleteGetCommentsData(true);

        dispatch({ type: "fulfiled" });
      } catch (error: any) {
        alert(error.message);
        dispatch({ type: "reject" });
      }
      setIntersecting(false);
    };
    getCommentData();
  }, [
    dispatch,
    completeGetCommentsData,
    state,
    setIntersecting,
    comments,
    setComments,
    collectionName,
    contentId,
    intersecting,
  ]);

  useEffect(() => {
    if (!openOption) return;

    const toggleOptionModal = (e: MouseEvent) => {
      if (
        !optionRef.current[pickedCommentInfo.index]?.contains(e.target as Node)
      ) {
        clickedElement.current = null;
        setOpenOption(false);
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
  }, [openOption, scrollY, pickedCommentInfo]);

  const reviseReviewHandler = async () => {
    /* 작성한 리뷰를 수정한다. */
    const { year, month, date, time } = nowDate();

    const changedData: Comment = {
      name: pickedCommentInfo.userName,
      text: saveInputRef.current!.value,
      uid: pickedCommentInfo.userUid,
      when: year + "-" + month + "-" + date + "-" + time,
      userPhoto: userData.userPhoto,
      createdAt: serverTimestamp(),
    };

    let newArray = [...comments];

    const prevDocumentName =
      newArray.splice(pickedCommentInfo.index, 1)[0].when +
      "=" +
      pickedCommentInfo.userUid;
    const newDocumentName = changedData.when + "=" + changedData.uid;

    const DeleteDocumentRef = doc(
      db,
      collectionName,
      contentId,
      "comment",
      prevDocumentName
    );
    const NewDocumentRef = doc(
      db,
      collectionName,
      contentId,
      "comment",
      newDocumentName
    );

    const batch = writeBatch(db);
    batch.set(NewDocumentRef, changedData);
    batch.delete(DeleteDocumentRef);

    newArray = [changedData, ...newArray];

    try {
      await batch.commit();
      setComments(newArray);
    } catch (error: any) {
      console.log(error.message);
      alert(`에러가 발생했습니다. 에러가 계속 발생한다면 문의해주세요!`);
    }

    setPickedCommentInfo({
      userName: "",
      userUid: "",
      when: "",
      index: -100,
    });
  };

  const optionClickHandler = (
    e: React.MouseEvent,
    userName: string,
    userUid: string,
    when: string,
    index: number
  ) => {
    e.stopPropagation();
    if (clickedElement.current?.contains(e.target as Node)) {
      // 사용자가 전에 클릭했던 Element('review-option')와 같은 옵션 아이콘을 클릭했을 시,
      clickedElement.current = null;
      setOpenOption(false);
      setPickedCommentInfo({
        userName: "",
        userUid: "",
        when: "",
        index: -100,
      });
    } else {
      // 다른 태그('review-option')를 클릭했을 시,
      clickedElement.current = e.target as HTMLDivElement;
      setPickedCommentInfo({ userName, userUid, when, index });
      setOpenOption(true);
    }
    setScrollY(window.scrollY);
  };

  return (
    <div className="user-comments">
      {comments.length === 0 && !state.loading && (
        <p>등록된 리뷰가 없습니다!</p>
      )}
      {comments.length !== 0 &&
        comments.map((item, index) => (
          <div key={index} className="user-comment-box">
            <div className="user-icon">
              {item.userPhoto.length !== 0 && (
                <img src={`${item.userPhoto}`} alt="userPhoto" />
              )}
              {item.userPhoto.length === 0 && item.name.length !== 0 && (
                <p>{item.name[0].toUpperCase()}</p>
              )}
            </div>
            {index === pickedCommentInfo.index && reviseReview ? (
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
            ) : (
              <>
                <div className="top">
                  <span className="name">{item.name}</span>
                  <FontAwesomeIcon
                    className="comment-option"
                    style={{
                      display:
                        openOption && pickedCommentInfo.index === index
                          ? "block"
                          : "",
                    }}
                    onClick={(event) =>
                      optionClickHandler(
                        event,
                        item.name,
                        item.uid,
                        item.when,
                        index
                      )
                    }
                    ref={(el: SVGSVGElement) =>
                      (optionRef.current[`${index}`] = el)
                    }
                    icon={faEllipsisVertical}
                  />
                  {openOption &&
                    item.uid === pickedCommentInfo.userUid &&
                    item.when === pickedCommentInfo.when && (
                      <OptionModal
                        item={item}
                        userUid={userData.userUid}
                        setOpenOption={setOpenOption}
                        setReviseReview={setReviseReview}
                        setOpenDelete={setOpenDelete}
                        setReportModal={setReportModal}
                      />
                    )}
                </div>
                <div className="comment-text">
                  <span style={{ whiteSpace: "pre-wrap" }}>{item.text}</span>
                </div>
                {openDelete && (
                  <DeleteModal
                    when={pickedCommentInfo.when}
                    uid={pickedCommentInfo.userUid}
                    index={pickedCommentInfo.index}
                    collectionName={collectionName}
                    contentId={contentId}
                    comments={comments}
                    setComments={setComments}
                    setOpenDelete={setOpenDelete}
                  />
                )}
              </>
            )}
          </div>
        ))}
      {state.loading && <LoadingSpinnerTwo width="25px" padding="8px" />}
      <div ref={targetRef}></div>
    </div>
  );
};

export default CommentBox;
