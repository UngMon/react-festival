import "./Loading.css";

interface T {
  height: string;
}

const Loading = ({ height }: T) => {
  return (
    <div className="rolling-box" style={{ height: height }}>
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

export default Loading;
