import { useEffect, useState } from "react";
import { FirebaseState } from "../../../type/Firebase";
import { Expression } from "../../../type/UserData";
import {
  DocumentData,
  DocumentReference,
  setDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { useAppDispatch } from "../../../redux/store";
import { firebaseActions } from "../../../redux/firebase-slice";
import { useSearchParams } from "react-router-dom";

let isFirst = true;

interface FeelingProps {
  firebaseState: FirebaseState;
  contentRef: DocumentReference<DocumentData>;
  contentId: string;
  uid: string;
}

const 유형: { [key: string]: string } = {
  "12": "관광지",
  "14": "문화시설",
  "15": "축제/공연/행사",
  "25": "여행코스",
};

const Feelings = ({
  firebaseState,
  contentRef,
  uid,
  contentId,
}: FeelingProps) => {
  const [params] = useSearchParams();
  const type = params.get("type")!;
  const dispatch = useAppDispatch();
  const [feelCount, setFeelCount] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [userPick, setUserPick] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    const commentData = firebaseState.contentData[contentId].expression;

    let Good = 0;
    let Soso = 0;
    let Bad = 0;

    for (let user in commentData) {
      const { 좋아요, 그저그래요, 싫어요 } = commentData[user];
      if (user === uid) {
        setUserPick([좋아요, 그저그래요, 싫어요]);
        continue;
      }
      Good += 좋아요;
      Soso += 그저그래요;
      Bad += 싫어요;
    }

    if (!uid) {
      setUserPick([0, 0, 0]);
    }

    setFeelCount([Good, Soso, Bad]);
  }, [firebaseState, contentId, uid]);

  useEffect(() => {
    // content페이지에서 로그아웃 할 시에 setDoc 방지를 위함.
    if (!firebaseState.loginedUser) {
      return;
    }

    if (userPick[0] === 1 || userPick[1] === 1 || userPick[2] === 1) {
      let docData: Expression = {};

      docData[uid] = {
        좋아요: userPick[0],
        그저그래요: userPick[1],
        싫어요: userPick[2],
      };

      setDoc(contentRef, { expression: docData }, { merge: true });
    }

    if (
      userPick[0] === 0 &&
      userPick[1] === 0 &&
      userPick[2] === 0 &&
      !isFirst
    ) {
      let updateData: { [key: string]: any } = {};
      updateData[`expression.${uid}`] = deleteField();
      updateDoc(contentRef, updateData);
    }
  }, [firebaseState, contentRef, uid, userPick]);

  const handler = (type: string) => {
    if (!firebaseState.loginedUser)
      return alert("로그인 하시면 이용하실 수 있습니다.");

    if (isFirst) isFirst = false;

    let userPicked: [number, number, number] = [0, 0, 0];

    if (type === "좋아요") userPicked = [userPick[0] === 0 ? 1 : 0, 0, 0];

    if (type === "그저그래요") userPicked = [0, userPick[1] === 0 ? 1 : 0, 0];

    if (type === "싫어요") userPicked = [0, 0, userPick[2] === 0 ? 1 : 0];

    setUserPick(userPicked);
    dispatch(firebaseActions.updateFeelingData({ contentId, userPicked, uid }));
  };

  return (
    <>
      <p className="How-to-feel">{`이 ${유형[type]} 어떻게 생각하세요?`}</p>
      <div className="Cotent-feeling">
        <div onClick={() => handler("좋아요")}>
          <img src="/images/Good.png" alt="Good" width="40"></img>
          <p
            style={{ color: userPick[0] === 1 ? "red" : "" }}
            className="feeling-count"
          >
            {feelCount[0] + userPick[0]}
          </p>
          <p> 좋아요 </p>
        </div>
        <div onClick={() => handler("그저그래요")}>
          <img src="/images/Soso.png" alt="Soso" width="40"></img>
          <p
            style={{ color: userPick[1] === 1 ? "red" : "" }}
            className="feeling-count"
          >
            {feelCount[1] + userPick[1]}
          </p>
          <p>그냥그래요</p>
        </div>
        <div onClick={() => handler("싫어요")}>
          <img src="/images/Bad.png" alt="Bad" width="40"></img>
          <p
            style={{ color: userPick[2] === 1 ? "red" : "" }}
            className="feeling-count"
          >
            {feelCount[2] + userPick[2]}
          </p>
          <p>음..별로?</p>
        </div>
      </div>
    </>
  );
};

export default Feelings;
