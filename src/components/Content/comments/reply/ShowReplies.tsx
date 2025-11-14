import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { fetchAndFilterReplies } from "api/fetchAndFilterReplies";
import LoadingSpinnerTwo from "components/Loading/LoadingSpinnerTwo";

interface T {
  open: boolean;
  setOpen: (value: boolean) => void;
  reply_count: number;
  origin_id: string;
  content_id: string;
}

const ShowReplies = ({
  open,
  setOpen,
  reply_count,
  origin_id,
  content_id,
}: T) => {
  const dispatch = useAppDispatch();
  const [isMount, setIsMount] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const last_index = useSelector((state: RootState) => state.reply.last_index);

  const showRepliesHandler = async () => {
    // 모든 답글 데이터를 불러왔다면 return
    setOpen(!open);

    if (last_index[origin_id] === "finish" || !isMount) return;
    setIsMount(false);

    try {
      setLoading(true);
      await dispatch(fetchAndFilterReplies({ origin_id, content_id })).unwrap();
    } catch (error: any) {
      alert("답글을 불러오지 못 했습니다.");
    } finally {
      setLoading(false);
    }
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
      {loading && <LoadingSpinnerTwo width="25px" padding="8px" />}
    </>
  );
};

export default ShowReplies;
