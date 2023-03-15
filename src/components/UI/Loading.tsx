import "./Loading.css";

const Loading = () => {
  return (
    <div className="rolling-box">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
