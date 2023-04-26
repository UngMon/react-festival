import "./GetDataError.css";

const GetDataError = () => {
  return (
    <div className="get-data-error-box">
      <p>😱  데이터를 불러오지 못 했습니다.</p>
      <p>
        새로고침을 해도 오류가 계속 발생할 시, <br/>아래 이메일로 문의해주세요!
      </p>
    </div>
  );
};

export default GetDataError;
