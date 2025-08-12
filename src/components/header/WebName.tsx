import "./WebName.css";

interface T {
  type: string;
}

const WebName = ({ type }: T) => {
  const style: Record<string, string | undefined> = {
    position: type === "login" ? "absolute" : undefined,
    top: type === "login" ? "-60px" : undefined,
    width: type === "login" ? "100%" : "100px",
  };

  return (
    <h2 className={`webname ${type !== "login" && "name-color"}`} style={style}>
      <span>이</span>
      <span>곳</span>
      <span>저</span>
      <span>곳</span>
    </h2>
  );
};

export default WebName;
