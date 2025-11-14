import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { originCommentActions } from "../../store/origin_comment-slice";
import { CommentType, LikedComment, LikedContent } from "type/DataType";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { UserData } from "type/UserDataType";
import { db } from "../../firebase";
import {
  collection,
  deleteField,
  doc,
  DocumentData,
  DocumentReference,
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
import Card from "./Card";
import LoadingSpinnerTwo from "components/Loading/LoadingSpinnerTwo";
import "./UserLogs.css";

interface T {
  category: string;
  userData: UserData;
}

const CATEGORY_TITLES: Record<string, string> = {
  myComment: "내가 작성한 댓글",
  likedComment: "좋아요 누른 댓글",
  likedContent: "좋아요 누른 콘텐츠",
};

// ===== 통합 state 타입 정리 =====
type LogItem = CommentType | LikedComment | LikedContent;
type GroupedLogs = Record<string, LogItem[]>; // { "오늘": [item1, item2], ... }
type ListState = Record<string, GroupedLogs>; // { "myComment": GroupedLogs, "likedComment": GroupedLogs, ... }

const formatDate = (isoString: string) => {
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
};

const UserLogs = ({ category, userData }: T) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  console.log("USerLog Render");
  const { current_user_id, status } = userData;
  const [loading, setLoading] = useState<boolean>(false);
  const [targetRef, intersecting] = useIntersectionObserver();
  const [list, setList] = useState<ListState>({});
  const [afterIndex, setAfterIndex] = useState<Record<string, string>>({
    myComment: "",
    likedComment: "",
    likedContent: "",
  });

  useEffect(() => {
    switch (true) {
      case status === "pending":
        return;
      case !current_user_id && status === "fulfilled":
        return navigate("/", { replace: true });
      case loading:
        return;
      case afterIndex[category] === "finish" ||
        afterIndex[category] === "error":
        return;
      case !intersecting:
        return;
    }
    setLoading(true);

    const getDataHandler = async () => {
      try {
        const queryConfig = {
          myComment: {
            ref: collection(db, "comments"),
            conditions: [where("user_id", "==", current_user_id)],
          },
          likedComment: {
            ref: collection(db, "userData", current_user_id, "like_users"),
            conditions: [],
          },
          likedContent: {
            ref: collection(db, "userData", current_user_id, "content"),
            conditions: [],
          },
        };

        const { ref, conditions } =
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
        console.log();
        const response = await getDocs(queryRef);
        const data = response.docs.map((doc) => doc.data()) as LogItem[];

        setAfterIndex((prev) => {
          return {
            ...prev,
            [category]:
              data.length < 25 ? "finish" : data[data.length - 1].createdAt,
          };
        });

        setList((prevList) => {
          const newGroupedData: GroupedLogs = { ...(prevList[category] || {}) };

          data.forEach((item) => {
            const date_key: string = formatDate(item.createdAt);
            const existingItemsForDate = newGroupedData[date_key] || [];
            newGroupedData[date_key] = [...existingItemsForDate, item];
          });

          return {
            ...prevList,
            [category]: newGroupedData,
          };
        });
      } catch (error: any) {
        console.log(error.message);
        setAfterIndex((prev) => {
          return { ...prev, [category]: "error" };
        });
        alert("데이터를 불러오지 못 했습니다.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };
    getDataHandler();
  }, [
    category,
    current_user_id,
    status,
    afterIndex,
    intersecting,
    navigate,
    loading,
  ]);

  const deleteHandler = useCallback(
    async (
      date: string,
      index: number,
      item: CommentType | LikedComment | LikedContent
    ) => {
      const batch = writeBatch(db);
      let deleteCategory: string | null = null;
      let documentRef: DocumentReference<DocumentData>;

      if ("comment_id" in item) {
        // 좋아요 누른 댓글
        deleteCategory = "likedComment";
        const { comment_id, createdAt } = item;
        const updateRef = doc(db, "comments", createdAt + item.user_id);

        batch.update(updateRef, {
          like_count: increment(-1),
          [`like_users.${current_user_id}`]: deleteField(),
        });

        documentRef = doc(
          db,
          "userData",
          current_user_id,
          "liked_comments",
          comment_id
        );
      } else if ("like_content" in item) {
        // 좋아요 누른 컨텐츠
        deleteCategory = "likedContent";
        documentRef = doc(
          db,
          "userData",
          item.user_id,
          "content",
          item.content_id
        );
        const updateRef = doc(db, "content", item.content_id);
        batch.update(updateRef, {
          like_count: increment(-1),
        });
      } else if ("like_users" in item) {
        // 내가 작성한 댓글
        deleteCategory = "myComment";

        const documentId = item.createdAt + item.user_id;
        documentRef = doc(db, "comments", documentId);
      }

      if (deleteCategory === null) return;

      batch.delete(documentRef!);

      try {
        if ("like_users" in item && item.origin_id) {
          // deleteCategory === 'myComment'
          const originDocRef = doc(db, "comments", item.origin_id);
          const originDoc = await getDoc(originDocRef);

          if (originDoc.exists()) {
            batch.update(originDocRef, {
              reply_count: increment(-1),
            });

            dispatch(
              originCommentActions.subtractionCount({
                origin_id: item.origin_id,
              })
            );
          }
        }

        await batch.commit();

        setList((prevList) => {
          const dateData = prevList[deleteCategory!][date];
          const newDateData = dateData.filter((_, idx) => idx !== index);

          const newCategoryData = {
            ...prevList[category],
            [date]: newDateData,
          };

          if (newDateData.length === 0) {
            delete newCategoryData[date];
          }

          return {
            ...prevList,
            [category]: newCategoryData,
          };
        });
      } catch (error) {
        console.log(error);
        alert("데이터 삭제에 문제가 발생했습니다!");
      }
    },
    [dispatch, category, current_user_id]
  );

  const renderComments = useMemo(() => {
    const dataForCategory = list[category] || {};
    const array = Object.entries(dataForCategory);

    // 10. 초기 로딩/에러 상태 처리를 위한 변수
    const hasData = array.length > 0;
    const isFinished = afterIndex[category] === "finish";

    // 데이터 없음 (초기 로드 완료 후)
    if (!hasData && isFinished && !loading) {
      return <div id="Nonexistent">활동 기록이 없습니다.</div>;
    }

    return (
      <>
        {array?.map((item, idx) => (
          <div key={idx}>
            <div id="date">{item[0]}</div>
            {item[1].map((a, idx) => (
              <Card
                key={a.createdAt}
                item={a}
                index={idx}
                date={item[0]}
                deleteHandler={deleteHandler}
              />
            ))}
          </div>
        ))}
      </>
    );
  }, [afterIndex, category, deleteHandler, list, loading]);

  return (
    <div className="content-view">
      <h2 id="top-title">{`${CATEGORY_TITLES[category]}`}</h2>
      {renderComments}
      {loading && <LoadingSpinnerTwo width="45px" padding="10px" />}
      {!loading && afterIndex[category] === "error" && (
        <p className="log-error-text">"데이터를 불러오지 못 했습니다."</p>
      )}
      <div className="target" ref={targetRef}></div>
    </div>
  );
};

export default UserLogs;
