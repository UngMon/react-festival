import { useState } from "react";
import { db } from "../../../../firebase";
import { UserData } from "../../../../type/UserDataType";
import { Comment } from "../../../../type/DataType";
import { RootState, useAppDispatch } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { replyActions } from "../../../../redux/reply-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  QueryConstraint,
} from "firebase/firestore";
import CommentBox from "../comment/CommentBox";
import LoadingSpinnerTwo from "../../../loading/LoadingSpinnerTwo";

interface T {
  origin_index: number;
  comment_data: Comment;
  myReply: Record<string, Record<string, Comment>>;
  userData: UserData;
}

const ReplyBox = ({ origin_index, comment_data, myReply, userData }: T) => {
  console.log("Reply Box Render!");
  const dispatch = useAppDispatch();
  const replyComments = useSelector((state: RootState) => state.reply.comment);
  const [open, setOpen] = useState<boolean>(false);
  const [isFristMount, setIsFirstMount] = useState<boolean>(true);
  const [completeGetAllCommentsData, setCompleteGetAllCommentsData] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { createdAt, user_id, content_id, reply_count } = comment_data;
  const [index, setIndex] = useState<string>("");
  const origin_id = createdAt + user_id;

  const getReplyDataHandler = async () => {
    setLoading(true);

    const commentRef = collection(db, "comments", origin_id, "comments");

    try {
      const queryConstraints: QueryConstraint[] = [
        where("content_id", "==", content_id),
        where("origin_id", "==", origin_id),
        orderBy("createdAt"),
        limit(25),
      ];

      if (index !== "") queryConstraints.push(startAfter(index));

      const Query = query(commentRef, ...queryConstraints);

      const data = await getDocs(Query);
      const comment_datas = data.docs.map((docs) => docs.data()) as Comment[];
      
      if (comment_datas.length > 0) {
        dispatch(replyActions.setNewReply({ origin_id, comment_datas }));
        setIndex(comment_datas[comment_datas.length - 1].createdAt);
      }

      if (comment_datas.length < 25) setCompleteGetAllCommentsData(true);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
    setLoading(false);
  };

  const showRepliesHandler = () => {
    if (isFristMount) {
      setIsFirstMount(false);
      getReplyDataHandler();
    }

    setOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className="reply-count" onClick={showRepliesHandler}>
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{
            transform: open ? "rotate(180deg)" : "",
          }}
        />
        <span>{`${reply_count}개의 답글 보기`}</span>
      </div>
      {open &&
        replyComments[origin_id]?.map((item, index) => {
          const replyKey = item.createdAt + item.user_id;

          if (myReply[origin_id]?.[replyKey] === undefined) {
            return (
              <CommentBox
                key={replyKey}
                origin_index={origin_index}
                reply_index={index}
                type={"reply"}
                deepth={0}
                comment_data={item}
                userData={userData}
              />
            );
          } else return null;
        })}
      {loading ? (
        <LoadingSpinnerTwo width="25px" padding="8px" />
      ) : (
        open &&
        !completeGetAllCommentsData && (
          <button
            className="reply_more"
            type="button"
            onClick={() => {
              setLoading(true);
              getReplyDataHandler();
            }}
          >
            <span>답글 더보기</span>
          </button>
        )
      )}
    </>
  );
};

export default ReplyBox;
