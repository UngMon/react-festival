import "./Loading.css";

const LoadingTwo = () => {
  return (
    <div className="rolling-box-two">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="lds-p">loading.....</p>
    </div>
  );
};

export default LoadingTwo;