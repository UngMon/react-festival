import { setDoc, doc, updateDoc, deleteField } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../firebase/firestore";
import { nowDate } from "../../modules/NowData";
import { RootState } from "../../redux/store";
import { Comment, Expression } from "../../modules/Type";
import Loading from "../UI/Loading";
import "./Review.css";

interface ReviewProps {
  contentId: string;
}

let isFirst = true;

const Review = ({ contentId }: ReviewProps) => {
  const firebaseState = useSelector((state: RootState) => state.firebase);
  const uid = firebaseState.userUid || "";

  const [reviewArray, setReviewArray] = useState<Comment[]>([]);
  const contentRef = doc(db, "content", contentId);

  const [feelCount, setFeelCount] = useState<[number, number, number]>([
    0, 0, 0,
  ]);

  const [userPick, setUserPick] = useState<[number, number, number]>([0, 0, 0]); //
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firebaseState.succesGetData) {
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
      setFeelCount([Good, Soso, Bad]);
      setReviewArray(firebaseState.contentData[contentId].comment);
    }
  }, [firebaseState, contentId, uid]);

  useEffect(() => {
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
  });

  const handler = (type: string) => {
    if (!firebaseState.loginedUser)
      return alert("로그인 하시면 이용하실 수 있습니다.");

    if (isFirst) isFirst = false;

    let userPicked: [number, number, number] = [0, 0, 0];

    if (type === "좋아요") userPicked = [userPick[0] === 0 ? 1 : 0, 0, 0];

    if (type === "그저그래요") userPicked = [0, userPick[1] === 0 ? 1 : 0, 0];

    if (type === "싫어요") userPicked = [0, 0, userPick[2] === 0 ? 1 : 0];

    setUserPick(userPicked);
  };

  const reviewInputHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (!firebaseState.loginedUser)
      return alert("로그인 하시면 이용하실 수 있습니다.");

    const text = inputRef.current!.value;

    if (text.length === 0) {
      return alert('글자를 입력해주세요!');
    }
    const { year, month, date, time } = nowDate();

    const fieldData = {
      name: firebaseState.userName,
      uid: uid,
      when: year + "-" + month + "-" + date + " " + time,
      text,
    };

    const array = [fieldData, ...reviewArray];

    setDoc(contentRef, { comment: array }, { merge: true });
    setReviewArray(array);
  };

  const optionClickHandler = (itemUid: string) => {
    if (itemUid === uid) {
      
    }
  };

  return (
    <div className="Cotent-review">
      <p className="How-to-feel">이 축제/행사 어떻게 생각하세요?</p>
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
          <p>그저저럭</p>
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
      <form className="user-input-box" onSubmit={reviewInputHandler}>
        <input
          type="text"
          id="user-input"
          placeholder="여러분의 소중한 리뷰를 작성해주세요!"
          ref={inputRef}
        ></input>
        <button type="submit">입력</button>
      </form>
      <div className="user-review-area">
        {!firebaseState.succesGetData ? (
          <Loading />
        ) : reviewArray.length !== 0 ? (
          reviewArray.map((item, index) => (
            <div key={index} className="user-review-box">
              <div className="name-and-option">
                <div className="user-name">{item.name}</div>
                <div
                  className="review-option"
                  onClick={() =>optionClickHandler(item.uid)}
                >
                  옵션
                </div>
              </div>
              <div className="review-text">{item.text}</div>
            </div>
          ))
        ) : (
          <div>
            <p>등록된 리뷰가 없습니다!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
