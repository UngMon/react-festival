import { useEffect, useState } from "react";
import { ContentFeel } from "type/DataType";
import { RootState } from "store/store";
import { useSelector } from "react-redux";
import { increment, getDoc, writeBatch } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../../firebase";
import LoadingSpinnerTwo from "components/Loading/LoadingSpinnerTwo";
import "./LikeButton.css";

interface T {
  content_id: string;
}

const LikeButton = ({ content_id }: T) => {
  const { status, current_user_id } = useSelector((state: RootState) => state.firebase);
  const { detailCommon } = useSelector((state: RootState) => state.content);
  const [loading, setLoading] = useState<boolean>(true);
  const [like_count, setLikeCount] = useState<number>(0);
  const [existData, setExistData] = useState<{
    hasFeelData: boolean;
    hasUserLike: boolean;
  }>({ hasFeelData: false, hasUserLike: false });

  useEffect(() => {
    if (!loading || status === "pending") return;
    if (status === "fulfilled" && current_user_id === "") {
      return setLoading(false);
    }

    const getFeelingData = async () => {
      const feelRef = doc(db, "content", content_id);
      const userRef = doc(db, "userData", current_user_id, "content", content_id);
      console.log(current_user_id, content_id);
      try {
        const promise = [getDoc(feelRef)];
        if (current_user_id) promise.push(getDoc(userRef));
        let existFeelData = false;
        let existUserLike = false;

        const [feelData, userData] = await Promise.all(promise);
        if (feelData.exists()) {
          const feelingsData = feelData.data() as ContentFeel;
          existFeelData = true;
          setLikeCount(feelingsData.like_count);
        }

        if (userData.exists()) existUserLike = true;

        setExistData({
          hasFeelData: existFeelData,
          hasUserLike: existUserLike,
        });
      } catch (error: any) {
        console.log(error);
        alert(error.message);
      }
      setLoading(false);
    };

    getFeelingData();
  }, [content_id, loading, current_user_id, status]);

  const handler = async () => {
    if (current_user_id === "") return alert("로그인 하시면 이용하실 수 있습니다.");

    if (!detailCommon || detailCommon?.length === 0)
      return alert("콘텐츠 정보를 불러오지 못해 이용하실 수 없습니다.");

    const batch = writeBatch(db);

    const feelRef = doc(db, "content", content_id);
    const userRef = doc(db, "userData", current_user_id, "content", content_id);
    let countChange: number = 0;
    const createdAt = new Date(
      new Date().getTime() + 9 * 60 * 60 * 1000
    ).toISOString();

    try {
      /* 사용자가 좋아요 버튼을 클릭한 기록이 없는 상황 */
      if (!existData.hasUserLike) {
        const { contentid, contenttypeid, title, firstimage, firstimage2 } =
          detailCommon[0];

        const userFeelData = {
          content_type: contenttypeid,
          cotnent_id: contentid,
          content_title: title,
          image_url: firstimage || firstimage2 || "",
          current_user_id,
          createdAt,
        };

        setExistData({ ...existData, hasUserLike: true });

        if (existData.hasFeelData) {
          batch.update(feelRef, { like_count: increment(1) });
        } else {
          batch.set(feelRef, {
            like_count: 1,
          });
        }

        batch.set(userRef, userFeelData);
        countChange = 1;
      } else {
        /* 사용자가 좋아요 클릭한 기록이 있는 상황 */
        setExistData({ ...existData, hasUserLike: false });
        batch.update(feelRef, { like_count: increment(-1) });
        batch.delete(userRef);
        countChange = -1;
      }
      setLikeCount(like_count + countChange);
      await batch.commit();
    } catch (error) {
      console.log(error);
      alert("오류가 발생했습니다!");
    }
  };

  return (
    <>
      <p className="How-to-feel">{`이 콘텐츠 어떻게 생각하세요?`}</p>
      <div className="Cotent-feeling">
        <div className="feel-box" onClick={handler}>
          <div className={existData.hasUserLike ? "like is-active" : "like"} />
          {!loading && (
            <p
              className={`feeling-count ${
                existData.hasUserLike ? "liked" : ""
              }`}
            >
              {like_count}
            </p>
          )}
          {loading && <LoadingSpinnerTwo width="15px" padding="6px" />}
        </div>
      </div>
    </>
  );
};

export default LikeButton;
