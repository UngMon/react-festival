import Card from "../card/Card";
import Picker from "../ui/Picker";

interface T {
  title: "tour" | "culture" | "travel" | 'result' | 'festival';
}

const Festival = ({ title }: T) => {
  return (
    <main className="main-box">
      {title !== "result" && <Picker title={title} />}
      <Card title={title} />
    </main>
  );
};

export default Festival;
