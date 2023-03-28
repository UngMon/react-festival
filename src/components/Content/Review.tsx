import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import "./Review.css";

interface ReviewProps {
  contentId: string;
};

const Review = ({ contentId }: ReviewProps) => {
  const firebaseState = useSelector((state: RootState) => state.firebase);

  const [good, setGood] = useState<number>(0);
  const [soso, setSoso] = useState<number>(0);
  const [bad, setBad] = useState<number>(0);

  const [isGood, setIsGood] = useState<boolean>(false);
  const [isSoso, setIsSoso] = useState<boolean>(false);
  const [isBad, setIsBad] = useState<boolean>(false);

  useEffect(() => {
    if (firebaseState.succesGetData) {
      const commentData = firebaseState.contentData[contentId].expression;
      setGood(commentData["좋아요"]);
      setSoso(commentData["그저그래요"]);
      setBad(commentData["싫어요"]);
    }
  }, [firebaseState, contentId]);

  const handler = (type: string) => {
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

  return (
    <div className="Cotent-review">
      <div className="Cotent-feeling">
        <div onClick={() => handler("좋아요")}>
          <img></img>
          <p>{good}</p>
          <p>좋아요</p>
        </div>
        <div onClick={() => handler("그저그래요")}>
          <img></img>
          <p>{soso}</p>
          <p>그저 그래요</p>
        </div>
        <div onClick={() => handler("싫어요")}>
          <img></img>
          <p>{bad}</p>
          <p>싫어요</p>
        </div>
      </div>
      <div className="user-input-box">
        <input
          type="text"
          id="user-input"
          placeholder="여러분의 소중한 리뷰를 작성해주세요!"
        ></input>
        <button>입력</button>
      </div>
      <div className="user-review">{/* {item.map()} */}</div>
    </div>
  );
};

export default Review;
