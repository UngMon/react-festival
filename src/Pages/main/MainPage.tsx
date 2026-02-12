import TopSlide from "../../features/main/TopSlide";
import BottomSlide from "../../features/main/BottomSlide";

const style: React.CSSProperties = {
  width: "100%",
  overflowX: "hidden",
  fontSize: "16px",
};

const MainPage = () => {
  return (
    <main style={style}>
      <TopSlide /> 
      <BottomSlide />
    </main>
  );
};

export default MainPage;
