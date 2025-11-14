import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store/store";
import { fetchAndFilterReplies } from "api/fetchAndFilterReplies";
import LoadingSpinnerTwo from "components/Loading/LoadingSpinnerTwo";

interface T {
  origin_id: string;
  content_id: string;
}

const MoreReplyButton = ({ origin_id, content_id }: T) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const last_index = useSelector((state: RootState) => state.reply.last_index);

  if (last_index[origin_id] === "finish" || !last_index[origin_id]) return null;

  const getReplyDataHandler = async () => {
    setLoading(true);

    try {
      await dispatch(fetchAndFilterReplies({ origin_id, content_id })).unwrap();
    } catch (error: any) {
      alert("댓글을 불러오지 못 했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinnerTwo width="25px" padding="8px" />
      ) : (
        <button
          className="reply_more"
          type="button"
          onClick={getReplyDataHandler}
        >
          <span>답글 더보기</span>
        </button>
      )}
    </>
  );
};

export default MoreReplyButton;
