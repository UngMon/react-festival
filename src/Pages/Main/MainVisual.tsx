import TopSlide from "./TopSlide";
import BottomSlide from "./BottomSlide";

const style: React.CSSProperties = {
  width: "100%",
  overflowX: "hidden",
  fontSize: "16px",
};

const MainVisual = () => {
  return (
    <main style={style}>
      <TopSlide /> 
      <BottomSlide />
    </main>
  );
};

export default MainVisual;
