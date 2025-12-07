import { LogItem, GroupedLogs } from "type/DataType";
import { UserData } from "type/UserDataType";
import { modalActions } from "store/modal-slice";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { originCommentActions } from "../../store/origin_comment-slice";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { deleteLogItem, getUserLogs } from "api/firestoreUtils";
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

interface ListState {
  afterIndex: string;
  datas: GroupedLogs;
}

const getFormattedDate = (isoString: string) => {
  const targetDate = new Date(isoString);
  const now = new Date();

  const target = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (target.getTime() === today.getTime()) return "오늘";
  if (target.getTime() === yesterday.getTime()) return "어제";

  return target.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
};

const UserLogs = ({ category, userData }: T) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { current_user_id, status } = userData;
  const [loading, setLoading] = useState<boolean>(false);
  const [targetRef, intersecting] = useIntersectionObserver();
  const [listInfo, setListInfo] = useState<Record<string, ListState>>({
    myComment: { afterIndex: "", datas: {} },
    likedComment: { afterIndex: "", datas: {} },
    likedContent: { afterIndex: "", datas: {} },
  });

  useEffect(() => {
    if (status === "pending") return;
    else if (listInfo[category].afterIndex === "finish") return;
    else if (listInfo[category].afterIndex === "error") return;
    else if (!current_user_id && status === "fulfilled")
      return navigate("/", { replace: true });
    else if (loading) return;
    else if (!intersecting) return;

    setLoading(true);

    const getDataHandler = async (category: string) => {
      try {
        const afterIndex = listInfo[category].afterIndex;
        const data = await getUserLogs(category, current_user_id, afterIndex);

        setListInfo((prevData) => {
          const newGroupedData = prevData[category].datas;
          let newAfterIndex = prevData[category].afterIndex;

          if (data.length > 0) {
            data.forEach((item) => {
              const date_key: string = getFormattedDate(item.createdAt);
              const existingItemsFromDate = newGroupedData[date_key] || [];
              newGroupedData[date_key] = [...existingItemsFromDate, item];
            });
          }

          if (data.length < 25) newAfterIndex = "finish";
          else newAfterIndex = data[data.length - 1].createdAt;

          return {
            ...prevData,
            [category]: { datas: newGroupedData, afterIndex: newAfterIndex },
          };
        });
      } catch (error: any) {
        setListInfo((prevData) => {
          const dataOfCategory = {
            datas: prevData[category].datas,
            afterIndex: "error",
          };

          return { ...prevData, [category]: dataOfCategory };
        });
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };
    getDataHandler(category);
  }, [
    category,
    current_user_id,
    status,
    intersecting,
    navigate,
    loading,
    listInfo,
  ]);

  const deleteHandler = useCallback(
    async (date: string, index: number, item: LogItem) => {
      if (!current_user_id) return;

      let api_state: string = "데이터를 삭제 중입니다.";

      try {
        dispatch(modalActions.toggleToastModal({ api_state }));

        const updatedOriginId = await deleteLogItem(
          category,
          current_user_id,
          item
        );

        if (updatedOriginId) {
          dispatch(
            originCommentActions.subtractionCount({
              origin_id: updatedOriginId,
            })
          );
        }

        setListInfo((prevData) => {
          const dataOfDate = prevData[category].datas[date];
          const filteredData = dataOfDate.filter((_, idx) => idx !== index);

          const updateCategoryData = {
            datas: { ...prevData[category].datas, [date]: filteredData },
            afterIndex: prevData[category].afterIndex,
          };

          if (filteredData.length === 0) delete updateCategoryData.datas[date];

          return {
            ...prevData,
            [category]: updateCategoryData,
          };
        });

        api_state = "데이터를 삭제했습니다.";
      } catch (error) {
        api_state = "오류가 발생했습니다.";
      } finally {
        dispatch(modalActions.toggleToastModal({ api_state }));
      }
    },
    [dispatch, category, current_user_id]
  );

  const dataForCategory = listInfo[category].datas;
  const array = Object.entries(dataForCategory);

  return (
    <div className="content-view">
      <h2 id="top-title">{`${CATEGORY_TITLES[category]}`}</h2>
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
      {loading ? (
        <LoadingSpinnerTwo width="45px" padding="10px" />
      ) : listInfo[category].afterIndex === "error" ? (
        <p className="log-error-text">"데이터를 불러오지 못 했습니다."</p>
      ) : (
        listInfo[category].afterIndex === "finish" && (
          <div id="Nonexistent">
            {array.length > 0
              ? "마지막 활동 기록 입니다."
              : "활동 기록이 없습니다."}
          </div>
        )
      )}
      <div className="target" ref={targetRef}></div>
    </div>
  );
};

export default UserLogs;
