import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  Comment,
  UserData,
  Report,
  PickComment,
} from "../../../type/UserDataType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import UserComment from "./UserComment";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";
import "./ReplyBox.css";

// commentBox에 useEffect로 state저장된 댓글 uid참조 번호를 넘겨서 렌더링하면
// 이 컴포넌트 안에 모든 요소들을 다시 렌더링 해야하니 성능 적으로 좋아 보이지 않습니다.
// 따라서 reply는 따로 컴포넌트를 작성해서 이 컴포넌트 안에서 로직이 돌아가도록 합시다.

interface T {
  origin: Comment;
  replyComments: Record<string, Comment[]>;
  userData: UserData;
  pickedComment: PickComment;
  setPickedComment: React.Dispatch<React.SetStateAction<PickComment>>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  setReportModal: React.Dispatch<React.SetStateAction<Report>>;
  setReplyComments: React.Dispatch<
    React.SetStateAction<Record<string, Comment[]>>
  >;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  dispatch: (value: { type: "pending" | "fulfiled" | "reject" }) => void;
}

const ReplyBox = ({
  origin,
  replyComments,
  pickedComment,
  setPickedComment,
  userData,
  clickedElement,
  setReportModal,
  setReplyComments,
  setComments,
  dispatch,
}: T) => {
  const [targetRef, intersecting, setIntersecting] =
    useIntersectionObserver(false);
  const [completeGetCommentsData, setCompleteGetCommentsData] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log(completeGetCommentsData, intersecting, loading)
    if (completeGetCommentsData || !intersecting || loading) return;
    const commentRef = collection(db, "comments");

    const getCommentData = async () => {
      console.log("?????????? reply useEffect");

      dispatch({ type: "pending" });
      setLoading(true);
      try {
        const Query = query(
          commentRef,
          where("contentId", "==", origin.contentId),
          where("originUid", "==", origin.originUid),
          orderBy("createdAt"),
          limit(50)
        );

        const data = await getDocs(Query);
        const newCommentsData = data.docs.map((docs) =>
          docs.data()
        ) as Comment[];

        const originComment: Comment[] = JSON.parse(
          JSON.stringify(replyComments[origin.createdAt + origin.uid])
        );

        if (newCommentsData.length > 0) {
          // replies 속성에 배열을 담아야 합니다.
          originComment.push(...newCommentsData);

          setReplyComments((prevReply) => ({
            ...prevReply,
            [origin.createdAt + origin.uid]: originComment,
          }));
        }

        if (newCommentsData.length < 50) setCompleteGetCommentsData(true);

        dispatch({ type: "fulfiled" });
      } catch (error: any) {
        console.log(error.message);
        alert(error.message);
        dispatch({ type: "reject" });
      }
      setIntersecting(false);
    };
    getCommentData();
  }, [
    dispatch,
    completeGetCommentsData,
    replyComments,
    intersecting,
    loading,
    origin,
    setReplyComments,
    setIntersecting,
  ]);

  return (
    <div className="reply-area">
      <div
        className="reply-count"
        onClick={() => {
          setPickedComment((prevState: PickComment) => {
            const { [origin.createdAt + origin.uid]: removed, ...rest } =
              prevState;
            if (pickedComment[origin.createdAt + origin.uid])
              return { ...rest } as PickComment;
            else
              return {
                ...prevState,
                [origin.createdAt + origin.uid]: "reply_open",
              };
          });
        }}
      >
        <FontAwesomeIcon icon={faChevronDown} />
        <span>{`${origin.reply_count}개의 답글 보기`}</span>
      </div>
      {!loading && pickedComment[origin.createdAt + origin.uid] === "reply_open" &&
        replyComments[origin.createdAt + origin.uid].map((item, index) => (
          <UserComment
            key={index}
            index={index}
            item={item}
            userData={userData}
            pickedComment={pickedComment}
            setPickedComment={setPickedComment}
            clickedElement={clickedElement}
            setReportModal={setReportModal}
            setComments={setComments}
            setReplyComments={setReplyComments}
          />
        ))}
      {pickedComment[origin.createdAt + origin.uid] === "reply_open" && (
        <div ref={targetRef} />
      )}
    </div>
  );
};

export default ReplyBox;
