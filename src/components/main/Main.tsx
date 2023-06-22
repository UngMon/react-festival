import Card from "../card/Card";
import UiBox from "../ui/UiBox";

interface T {
  title: string;
}

const Festival = ({ title }: T) => {
  return (
    <main className="main-box">
      <UiBox title={title} />
      <Card title={title} />
    </main>
  );
};

export default Festival;
