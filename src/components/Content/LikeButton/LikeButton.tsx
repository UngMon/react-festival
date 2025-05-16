import { useEffect, useRef } from "react";
import { ContentFeel } from "@/type/DataType";
import { LikedContent } from "@/type/DataType";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import { increment, getDoc, writeBatch } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/firebase";
import LoadingSpinnerTwo from "@/components/Loading/LoadingSpinnerTwo";
import "./LikeButton.css";

interface T {
  collectionName: string;
  content_id: string;
}

const LikeButton = ({ collectionName, content_id }: T) => {
  console.log("Feelings Component Render");
  const userData = useSelector((state: RootState) => state.firebase);
  const { detailCommon } = useSelector((state: RootState) => state.content);
  const [loading, setLoading] = useState<boolean>(true);
  const [like_count, setLikeCount] = useState<number>(0);
  const [existData, setExistData] = useState<[boolean, boolean]>([
    false,
    false,
  ]);
  const likeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading || userData.status === "pending") return;

    const getFeelingData = async () => {
      const feelRef = doc(db, "content", content_id);
      let userRef = doc(db, "users", userData.user_id, "content", content_id);

      try {
        const promise = [getDoc(feelRef)];
        if (userRef) promise.push(getDoc(userRef));
        let existFeelingData = false;
        let existUserData = false;

        const [feelData, userData] = await Promise.all(promise);
        if (feelData.exists()) {
          const feelingsData = feelData.data() as ContentFeel;
          existFeelingData = true;
          console.log(feelingsData);
          setLikeCount(feelingsData.like_count);
        }

        console.log(userData);
        if (userData.exists()) {
          const data = userData.data() as LikedContent;
          console.log(data);
          existUserData = true;
        }

        setExistData([existFeelingData, existUserData]);
      } catch (error: any) {
        console.log(error);
        alert(error.message);
      }
      setLoading(false);
    };

    getFeelingData();
  }, [collectionName, content_id, loading, userData]);

  const handler = async () => {
    if (userData.user_id === "")
      return alert("로그인 하시면 이용하실 수 있습니다.");

    if (!detailCommon || detailCommon?.length === 0)
      return alert("콘텐츠 정보를 불러오지 못해 이용하실 수 없습니다.");

    const batch = writeBatch(db);

    const feelRef = doc(db, "content", content_id);
    const userRef = doc(db, "users", userData.user_id, "content", content_id);
    let like_count: number = 0;
    const createdAt = new Date(
      new Date().getTime() + 9 * 60 * 60 * 1000
    ).toISOString();

    try {
      /* 사용자가 좋아요 버튼을 클릭한 기록이 없는 상황 */
      if (!existData[1]) {
        const { contentid, contenttypeid, title, firstimage, firstimage2 } =
          detailCommon[0];

        const createField = {
          content_type: contenttypeid,
          cotnent_id: contentid,
          content_title: title,
          image_url: firstimage || firstimage2 || "",
          createdAt,
        };

        setExistData((prevState) => [prevState[0], true]);

        if (existData[0]) batch.update(feelRef, { like_count: increment(1) });
        else
          batch.set(
            feelRef,
            {
              like_count: increment(1),
              content_id: contentid,
              content_title: title,
              content_type: contenttypeid,
            },
            { merge: true }
          );
        batch.set(userRef, createField);
        like_count = 1;
      } else {
        /* 사용자가 좋아요 클릭한 기록이 있는 상황 */
        setExistData((prevState) => [prevState[0], false]);
        batch.update(feelRef, { like_count: increment(-1) });
        batch.delete(userRef);
        like_count = -1;
      }
      setLikeCount((prevState) => prevState + like_count);
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
          <div
            className={existData[1] ? "like is-active" : "like"}
            ref={likeRef}
          />
          {!loading && (
            <p
              style={{ color: existData[1] ? "red" : "" }}
              className="feeling-count"
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
