import { setDoc, doc, updateDoc, deleteField } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../firebase/firestore";
import { nowDate } from "../../modules/NowData";
import { RootState } from "../../redux/store";
import { Comment } from "../../modules/Type";
import Loading from "../UI/Loading";
import "./Review.css";

interface ReviewProps {
  contentId: string;
}

let isFirst = true;

const Review = ({ contentId }: ReviewProps) => {
  const uid = "nothing";
  const firebaseState = useSelector((state: RootState) => state.firebase);

  const [reviewArray, setReviewArray] = useState<Comment[]>([]);
  const contentRef = doc(db, "content", contentId);

  const [good, setGood] = useState<number>(0);
  const [soso, setSoso] = useState<number>(0);
  const [bad, setBad] = useState<number>(0);

  const [isGood, setIsGood] = useState<boolean>(false);
  const [isSoso, setIsSoso] = useState<boolean>(false);
  const [isBad, setIsBad] = useState<boolean>(false);

  const [userPick, setUserPick] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firebaseState.succesGetData) {
      const commentData = firebaseState.contentData[contentId].expression;
      let dummyGood = 0;
      let dummySoso = 0;
      let dummyBad = 0;
      for (let user in commentData) {
        const { 좋아요, 그저그래요, 싫어요 } = commentData[user];
        dummyGood += 좋아요;
        dummySoso += 그저그래요;
        dummyBad += 싫어요;
        if (user === uid) {
          좋아요 === 1 && setUserPick("좋아요");
          그저그래요 === 1 && setUserPick("그저그래요");
          싫어요 === 1 && setUserPick("싫어요");
        }
      }
      setGood(dummyGood);
      setSoso(dummySoso);
      setBad(dummyBad);
      setReviewArray(firebaseState.contentData[contentId].comment);
    }
  }, [firebaseState, contentId]);

  useEffect(() => {
    let docData;

    if (isGood || isSoso || isBad) {
      docData = {
        himon: {
          좋아요: isGood ? 1 : 0,
          그저그래요: isSoso ? 1 : 0,
          싫어요: isBad ? 1 : 0,
        },
      };

      setDoc(contentRef, { expression: docData }, { merge: true });
    }
    if (!isGood && !isSoso && !isBad && !isFirst) {
      const updateData = {
        "expression.himon": deleteField(),
      };
      updateDoc(contentRef, updateData);
    }
  });

  const handler = (type: string) => {
    if (isFirst) {
      isFirst = false;
    }

    if (type === "좋아요") {
      if (isSoso) {
        setSoso(soso - 1);
        setIsSoso(false);
      }
      if (isBad) {
        setBad(bad - 1);
        setIsBad(false);
      }
      setGood((prevState) => (!isGood ? prevState + 1 : prevState - 1));
      setIsGood((prevState) => !prevState);
    }

    if (type === "그저그래요") {
      if (isGood) {
        setGood(good - 1);
        setIsGood(false);
      }

      if (isBad) {
        setBad(bad - 1);
        setIsBad(false);
      }

      setSoso((prevState) => (!isSoso ? prevState + 1 : prevState - 1));
      setIsSoso((prevState) => !prevState);
    }

    if (type === "싫어요") {
      if (isGood) {
        setGood(good - 1);
        setIsGood(false);
      }

      if (isSoso) {
        setSoso(soso - 1);
        setIsSoso(false);
      }

      setBad((prevState) => (!isBad ? prevState + 1 : prevState - 1));
      setIsBad((prevState) => !prevState);
    }
  };

  const reviewInputHandler = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(reviewArray);
    const { year, month, date, time } = nowDate();
    const text = inputRef.current!.value;
    const fieldData = {
      name: "hi",
      uid: "user-uid",
      when: year + "-" + month + "-" + date + " " + time,
      text,
    };
    const array = [...reviewArray, fieldData];
    setDoc(contentRef, { comment: array }, { merge: true });
    setReviewArray(array);
  };

  const optionClickHandler = (uid: string) => {
    
  };

  return (
    <div className="Cotent-review">
      <div className="Cotent-feeling">
        <div onClick={() => handler("좋아요")}>
          <img></img>
          <p style={{ color: userPick === "좋아요" ? "red" : "" }}>{good}</p>
          <p>좋아요</p>
        </div>
        <div onClick={() => handler("그저그래요")}>
          <img></img>
          <p style={{ color: userPick === "그저그래요" ? "red" : "" }}>
            {soso}
          </p>
          <p>그저 그래요</p>
        </div>
        <div onClick={() => handler("싫어요")}>
          <img></img>
          <p style={{ color: userPick === "싫어요" ? "red" : "" }}>{bad}</p>
          <p>싫어요</p>
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
                  onClick={optionClickHandler(item.uid)}
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
