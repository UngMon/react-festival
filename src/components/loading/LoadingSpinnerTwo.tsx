import "./LoadingSpinnerTwo.css";

interface T {
  width: string;
  padding: string;
}

const LoadingSpinnerTwo = ({ width, padding }: T) => {
  return (
    <div className="spinner-two">
      <div className="loader" style={{ width, padding }}></div>
    </div>
  );
};

export default LoadingSpinnerTwo;
