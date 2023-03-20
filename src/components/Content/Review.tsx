import "./Review.css";

const Review = () => {
  return (
    <div className="Cotent-review">
      <div className="Cotent-feeling">
        <div>
          <img></img>
          <p>좋아요</p>
        </div>
        <div>
          <img></img>
          <p>그저 그래요</p>
        </div>
        <div>
          <img></img>
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
