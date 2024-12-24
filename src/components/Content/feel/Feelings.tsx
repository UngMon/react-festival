import React, { useEffect, useRef } from "react";
import { Feel } from "../../../type/UserDataType";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import {
  updateDoc,
  increment,
  FieldValue,
  collection,
  deleteField,
  getDoc,
} from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../../firebase";
import LoadingSpinnerTwo from "../../loading/LoadingSpinnerTwo";
import "./Feelings.css";

interface T {
  collectionName: string;
  content_id: string;
}

const Feelings = React.memo(({ collectionName, content_id }: T) => {
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
      // 좋아요 누른 콘텐츠 페이지도 고려해야 한다.
      // => ?.? 여기서는 어떻게 하나
      // 사용자가 누른 기록을 필드에 데이터를 저장할 것인지 아니면 문서에 따로 저장할 것인지?
      // content 마다 하위 컬렉션을 두면 이게 한번에 조회가 안 된다.
      // 따라서 feelings라는 컬렉션안에 content_id 문서를 만들고, count와 user목록을 따로 두는게 좋지 않을까?
      // 그리고 데이터를 불러올 때, user목록은 query를 이용해서 해당 사용자 데이터만 불러오도록 하는것이지.

      const feelRef = doc(db, "feelings", content_id);

      // const countRef = doc(db, collectionName, content_id, "feeling", "count");
      // const userPickRef = doc(db, collectionName, content_id, userData.user_id);

      try {
        const feelingsData = (await getDoc(feelRef)).data() as Feel;

        setLikeCount(feelingsData.like);
        setDisLikeCount(feelingsData.dislike);

        const user_pick = feelingsData.users[userData.user_id];

        if (user_pick) setUserPick(user_pick.reaction);

        // const [count, userPicked] = (await Promise.all(
        //   userData.user_id !== ""
        //     ? [
        //         (await getDoc(countRef)).data(),
        //         // (await getDoc(userPickRef)).data(),
        //       ]
        //     : [(await getDoc(countRef)).data()]
        // )) as [Count | undefined, { pick: string } | undefined];
        // const feelingData = (await getDoc(feelRef)).data() as Feel;
        // setLikeCount(feelingData.like);
        // setDisLikeCount(feelingData.dislike);
        // let index = feelingData.users.findIndex(
        //   (user) => user.user_id === userData.user_id
        // );
        // if (index === -1) return;
        // setUserPick(feelingData.users[index].reaction);
        // if (count) {
        //   setLikeCount(count.like);
        //   setDisLikeCount(count.dislike);
        // } else await setDoc(countRef, { like: 0, dislike: 0 });
        // if (userPicked) setUserPick(userPicked.pick);
      } catch (error: any) {
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
    // const collectionRef = collection(db, "feelings");

    /*
     1. 데이터셋을 다시 해야할 필요가 있다.
     2. {like, dislike, user_id...}
     3. or {like, dislike, users: [{user_id: string, reaction: string}, ...]}
     3번의 경우 데이터셋을 저렇게 설정하면 transaction 사용이 불가피 해보인다.
     runTrancsaction으로 먼저 데이터셋을 불러오고 다시 update or remove
     2번의 경우 사용자 하나에 대해서만 할 수 있으므로, 첫 렌더링시에  promise.all로 두번 동시에 불러오기만 하면됨.
     또한 만약 users 배열의 크기가 커진다면 데이터를 불러오는데 시간이 좀더 걸릴 수도 있다.
    */

    // const countRef = doc(db, collectionName, content_id, "feeling", "count");
    // const userPickRef = doc(
    //   db,
    //   collectionName,
    //   content_id,
    //   "userpick",
    //   userData.user_id
    // );

    let newDataObject: Record<string, FieldValue> = {};
    let user_id = userData.user_id;

    try {
      /* 사용자가 이전에 좋아요, 싫어요를 클릭한 기록이 없는 상태 */
      if (userPick === "") {
        newDataObject[type] = increment(1);
        // newDataObject["users"][user_id] = { reaction: type, time: 0 };
        setUserPick(type);

        if (type === "like") setLikeCount(like_count + 1);
        else setDisLikeCount(dislike_count + 1);

        await updateDoc(feelRef, {
          ...newDataObject,
          users: { reaction: type, time: 0 },
        });

        // await Promise.all([
        //   setDoc(countRef, newDataObject, { merge: true }),
        //   setDoc(userPickRef, { pick: type }),
        // ]);
        return;
      }

      /* 아래 코드는 사용자가 이전에 좋아요, 싫어요를 클릭한 기록이 있는 상태 */

      if (type === userPick) {
        /* 사용자가 이전과 같은 감정 아이콘을 클릭한 경우 0으로 초기화 */
        newDataObject[userPick] = increment(-1);
        // newDataObject[user_id] = deleteField();
        setUserPick("");

        if (type === "like") setLikeCount(like_count - 1);
        else setDisLikeCount(dislike_count - 1);

        await updateDoc(feelRef, {
          ...newDataObject,
          users: deleteField(),
        });

        // await Promise.all([
        //   updateDoc(countRef, newDataObject),
        //   deleteDoc(userPickRef),
        // ]);
        return;
      }

      /* 사용자가 이전과 다른 감정 아이콘을 클릭할 때 */
      const a: number = type === "like" ? 1 : -1;
      newDataObject[type] = increment(1);
      // newDataObject[user_id] = { reaction: type, time: 0 };
      setUserPick(type);
      setLikeCount(like_count + a);
      setDisLikeCount(dislike_count - a);

      await updateDoc(feelRef, {...newDataObject, users: {reaction: type, time: 0}});

      // await Promise.all([
      //   updateDoc(countRef, { like: increment(a), dislike: increment(-a) }),
      //   updateDoc(userPickRef, { userUid: { pick: type } }),
      // ]);
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
});

export default Feelings;
