import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { originCommentActions } from "../../store/origin_comment-slice";
import { Comment, LikedComment, LikedContent } from "../../type/DataType";
import { db } from "../../firebase";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  writeBatch,
} from "firebase/firestore";
import UserData from "./UserData";
import LoadingSpinnerTwo from "../../components/Loading/LoadingSpinnerTwo";

interface T {
  category: string;
  user_id: string;
}

const PageCard = ({ category, user_id }: T) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isFinished, setIsFinished] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [myComment, setMyComment] = useState<Record<string, Comment[]>>({});
  const [likedContent, setLikedContent] = useState<
    Record<string, LikedContent[]>
  >({});
  const [likedComment, setLikedComment] = useState<
    Record<string, LikedComment[]>
  >({});
  const [afterIndex, setAfterIndex] = useState<Record<string, string>>({
    myComment: "",
    likedComment: "",
    likedContent: "",
  });

  const formatDate = useCallback((isoString: string) => {
    const date = new Date(isoString);

    // 한국 시간(KST)으로 변환
    const today = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // 변환할 날짜도 한국 시간(KST) 기준으로 변환
    const targetDate = new Date(date.getTime() - 9 * 60 * 60 * 1000);

    // 날짜 문자열 (YYYY-MM-DD) 비교
    const todayStr = today.toISOString().split("T")[0];
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const targetDateStr = targetDate.toISOString().split("T")[0];

    if (targetDateStr === todayStr) {
      return "오늘";
    } else if (targetDateStr === yesterdayStr) {
      return "어제";
    } else {
      return targetDate.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
      }); // "3월 8일"
    }
  }, []);

  useEffect(() => {
    if (!user_id || isFinished[category] === "finished") return;

    const getDataHandler = async () => {
      setLoading(true);

      try {
        const queryConfig = {
          myComment: {
            ref: collectionGroup(db, "comments"),
            conditions: [where("user_id", "==", user_id)],
            stateSetter: setMyComment,
          },
          likedComment: {
            ref: collectionGroup(db, "like_users"),
            conditions: [where("user_id", "==", user_id)],
            stateSetter: setLikedComment,
          },
          likedContent: {
            ref: collection(db, "users", user_id, "content"),
            conditions: [],
            stateSetter: setLikedContent,
          },
        };

        const { ref, conditions, stateSetter } =
          queryConfig[
            category as "myComment" | "likedComment" | "likedContent"
          ];

        const paginationConditions =
          afterIndex[category].length > 0
            ? [startAfter(afterIndex[category])]
            : [];

        const queryRef = query(
          ref,
          ...conditions,
          orderBy("createdAt", "desc"),
          ...paginationConditions,
          limit(25)
        );

        const response = await getDocs(queryRef);
        const data = response.docs.map((doc) => doc.data());

        if (data.length === 0) return;

        if (data.length < 25) {
          setAfterIndex((prev) => {
            return { ...prev, [category]: "finished" };
          });
          setIsFinished((prev) => ({ ...prev, [category]: "finished" }));
        } else
          setAfterIndex((prev) => {
            return { ...prev, [category]: data[data.length - 1].createdAt };
          });

        stateSetter((prev: Record<string, (typeof data)[number][]>) => {
          const prevData = JSON.parse(JSON.stringify(prev));

          data.forEach((item) => {
            const d = item as Comment | LikedComment | LikedContent;
            const date_key: string = formatDate(item.createdAt);

            if (!prevData[date_key]) prevData[date_key] = [];
            prevData[date_key].push(d);
          });

          return prevData;
        });
      } catch (error: any) {
        console.log(error.message);
      }

      setLoading(false);
    };

    getDataHandler();
  }, [category, isFinished, user_id, afterIndex, formatDate]);

  const time = (createdAt: string) => {
    return new Date(createdAt).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const imageClickHandler = (content_type: string, content_id: string) => {
    let url: string = `type=${content_type}&cotent_id=${content_id}`;

    if (content_type === "15") {
    } else {
    }

    navigate(url);
  };

  const convertText = (content: [string, string, string]) => {
    let text = content.reduce(
      (acc, text, index) => (index !== 1 ? acc + text : acc),
      ""
    );
    return text.length > 70 ? text.slice(0, 70) + "..." : text;
  };

  const deleteHandler = async (
    date: string,
    index: number,
    item: Comment | LikedComment | LikedContent
  ) => {
    const batch = writeBatch(db);

    if ("content" in item) {
      console.log("작성한 댓글");
      const { origin_id, createdAt, user_id } = item;

      const pathSegements = origin_id
        ? [origin_id, "comments", createdAt + user_id]
        : [createdAt + user_id];

      const documentRef = doc(db, "comments", ...pathSegements);
      batch.delete(documentRef);
      setMyComment((prevState) => {
        return {
          ...prevState,
          [date]: prevState[date].filter((_, idx) => idx !== index),
        };
      });
    }

    if ("comment_id" in item) {
      console.log("좋아요 누른 댓글");
      const { user_id, comment_id, origin_id } = item;

      const pathSegements = origin_id
        ? [origin_id!, "comments", comment_id, "like_users", user_id]
        : [comment_id, "like_users", user_id];
      console.log(pathSegements);
      const documentRef = doc(db, "comments", ...pathSegements);
      batch.delete(documentRef);

      setLikedComment((prevState) => {
        return {
          ...prevState,
          [date]: prevState[date].filter((_, idx) => idx !== index),
        };
      });
    }

    if ("like_content" in item) {
      console.log("좋아요 누른 컨텐츠");
      const userDocRef = doc(
        db,
        "userData",
        item.user_id,
        "content",
        item.content_id
      );
      const documentRef = doc(db, "content", item.content_id);
      batch.delete(documentRef);
      batch.delete(userDocRef);
      setLikedContent((prevState) => {
        return {
          ...prevState,
          [date]: prevState[date].filter((_, idx) => idx !== index),
        };
      });
    }

    try {
      if ("content" in item && item.origin_id) {
        const originDocRef = doc(db, "comments", item.origin_id);
        const originDoc = await getDoc(originDocRef);

        if (originDoc.exists()) {
          batch.update(originDocRef, {
            reply_count: increment(-1),
          });

          dispatch(
            originCommentActions.subtractionCount({ origin_id: item.origin_id })
          );
        }
      }

      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  const renderComments = (
    data: Record<string, (Comment | LikedComment | LikedContent)[]>
  ) => {
    const entries = Object.entries(data);

    return (
      <>
        {!loading && entries.length === 0 && (
          <div id="Nonexistent">작성한 댓글이 없습니다.</div>
        )}
        {entries?.map((item, idx) => (
          <div key={idx}>
            <div id="date">{item[0]}</div>
            {item[1].map((a, idx) => (
              <UserData
                key={a.createdAt}
                item={a}
                index={idx}
                date={item[0]}
                convertText={convertText}
                imageClickHandler={imageClickHandler}
                deleteHandler={deleteHandler}
                time={time}
              />
            ))}
          </div>
        ))}
        {loading && <LoadingSpinnerTwo width="45px" padding="10px" />}
      </>
    );
  };

  return (
    <div className="content-view">
      <h2 id="top-title">내가 작성한 댓글</h2>
      {category === "myComment" && renderComments(myComment)}
      {category === "likedContent" && renderComments(likedContent)}
      {category === "likedComment" && renderComments(likedComment)}
    </div>
  );
};

export default PageCard;
