import "./Review.css";

const Review = () => {
  return (
    <div className="Cotent-review">
      <div className="Cotent-feeling">
        <div>좋아요</div>
        <div>그저 그래요</div>
        <div>싫어요</div>
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
