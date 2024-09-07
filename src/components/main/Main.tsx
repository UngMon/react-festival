import Card from "../card/Card";
import Picker from "../ui/Picker";
import Result from "../main/Result";

interface T {
  title:
    | "관광지"
    | "문화시설"
    | "여행코스"
    | "검색"
    | "축제/공연/행사"
    | "레포츠";
}

const Festival = ({ title }: T) => {
  console.log(title);

  return (
    <main>
      {title !== "검색" && <Picker title={title} />}
      {title !== "검색" ? <Card title={title} /> : <Result title={title} />}
    </main>
  );
};

export default Festival;
