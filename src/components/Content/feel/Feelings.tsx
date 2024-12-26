import { useEffect, useRef } from "react";
import { Feel } from "../../../type/UserDataType";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import {
  updateDoc,
  increment,
  FieldValue,
  deleteField,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../../firebase";
import LoadingSpinnerTwo from "../../loading/LoadingSpinnerTwo";
import "./Feelings.css";

interface T {
  collectionName: string;
  content_id: string;
}

const Feelings = ({ collectionName, content_id }: T) => {
  console.log("Feelings Component Render");
  const userData = useSelector((state: RootState) => state.firebase);

  const [loading, setLoading] = useState<boolean>(true);
  const [like_count, setLikeCount] = useState<number>(0);
  const [dislike_count, setDisLikeCount] = useState<number>(0);
  const [userPick, setUserPick] = useState<string>("");

  const likeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading || userData.loadingState === "pending") return;

    const getFeelingData = async () => {
      const feelRef = doc(db, "feelings", content_id);

      try {
        const feelingsData = (await getDoc(feelRef)).data() as Feel;

        if (feelingsData) {
          if (feelingsData.like) setLikeCount(feelingsData.like);
          if (feelingsData.dislike) setDisLikeCount(feelingsData.dislike);

          const user_pick = feelingsData.users[userData.user_id];

          if (user_pick) setUserPick(user_pick.reaction);
        }
      } catch (error: any) {
        console.log(error);
        alert(error.message);
      }
      setLoading(false);
    };

    getFeelingData();
  }, [collectionName, content_id, loading, userData]);

  const handler = async (type: string) => {
    if (!userData.loginedUser || userData.user_id === "")
      return alert("로그인 하시면 이용하실 수 있습니다.");

    const feelRef = doc(db, "feelings", content_id);
    let newDataObject: Record<string, FieldValue> = {};
    let user_id = userData.user_id;
    let users: Record<string, { reaction: string; time: number }> = {};

    try {
      /* 사용자가 이전에 좋아요, 싫어요를 클릭한 기록이 없는 상태 */
      if (userPick === "") {
        newDataObject[type] = increment(1);
        users[user_id] = { reaction: type, time: 0 };
        setUserPick(type);

        if (type === "like") setLikeCount(like_count + 1);
        else setDisLikeCount(dislike_count + 1);

        await setDoc(
          feelRef,
          {
            ...newDataObject,
            users,
          },
          { merge: true }
        );

        return;
      }

      /* 아래 코드는 사용자가 이전에 좋아요, 싫어요를 클릭한 기록이 있는 상태 */

      if (type === userPick) {
        /* 사용자가 이전과 같은 감정 아이콘을 클릭한 경우 0으로 초기화 */
        newDataObject[userPick] = increment(-1);
        setUserPick("");

        if (type === "like") setLikeCount(like_count - 1);
        else setDisLikeCount(dislike_count - 1);

        await updateDoc(feelRef, {
          ...newDataObject,
          [`users.${user_id}`]: deleteField(),
        });

        return;
      }

      /* 사용자가 이전과 다른 감정 아이콘을 클릭할 때 */
      const a: number = type === "like" ? 1 : -1;
      newDataObject[type] = increment(1);
      newDataObject[userPick] = increment(-1);
      users[user_id] = { reaction: type, time: 0 };

      setUserPick(type);
      setLikeCount(like_count + a);
      setDisLikeCount(dislike_count - a);

      await updateDoc(feelRef, {
        ...newDataObject,
        users,
      });

    } catch (error) {
      console.log(error);
      alert("오류가 발생했습니다!");
    }
  };

  return (
    <>
      <p className="How-to-feel">{`이 콘텐츠 어떻게 생각하세요?`}</p>
      <div className="Cotent-feeling">
        <div className="feel-box" onClick={() => handler("like")}>
          <div
            className={userPick === "like" ? "like is-active" : "like"}
            ref={likeRef}
          />
          {!loading && (
            <p
              style={{
                color: userPick === "like" && userData.loginedUser ? "red" : "",
              }}
              className="feeling-count"
            >
              {like_count}
            </p>
          )}
          {loading && <LoadingSpinnerTwo width="15px" padding="6px" />}
        </div>
        <div className="feel-box" onClick={() => handler("dislike")}>
          <div className="dislike">
            <div className={userPick === "dislike" ? "active" : ""}>
              <img
                className={userPick === "dislike" ? "is-active-two" : ""}
                src="/images/dislike.png"
                alt="dislike"
              />
            </div>
          </div>
          {!loading && (
            <p
              style={{
                color:
                  userPick === "dislike" && userData.loginedUser ? "red" : "",
              }}
              className="feeling-count"
            >
              {dislike_count}
            </p>
          )}
          {loading && <LoadingSpinnerTwo width="15px" padding="6px" />}
        </div>
      </div>
    </>
  );
};

export default Feelings;
