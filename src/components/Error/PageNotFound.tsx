import "./PageNotFound.css";

const PageNotFound = () => {
  return (
    <div className="Page-Not-Found">
      <h3>죄송합니다.</h3>
      <h4>요청하신 페이지를 찾을 수 없습니다.</h4>
      <p>방문하시려는 페이지의 주소가 잘못 입력되었거나, </p>
      <p>
        페이지의 주소가 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
      </p>
      <button>Go Back</button>
    </div>
  );
};

export default PageNotFound;
