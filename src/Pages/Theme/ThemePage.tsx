import { useRef } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { themedSlideData } from "constant/themeData";
import ThemeSlide from "./ThemeSlide";
import "./ThemePage.css";

const Check_Catgory = ["cafe", "bar", "culture", "musicplate", "flagship"];

const ThemePage = () => {
  const [param] = useSearchParams();
  const category = param.get("category");
  const clickedElement = useRef<HTMLElement | null>(null);

  if (!category || !Check_Catgory.includes(category)) {
    return <Navigate to="/theme?category=cafe" />;
  }

  const removeHashDuplication = (hash: string) => {
    const regex = /#([^#]+)/g;

    let match;
    let result = "";
    const tags = [];

    while ((match = regex.exec(hash)) !== null) {
      tags.push(match[0]);
    }

    const array = [...new Set(tags)];

    array.forEach((text) => (result += text));

    return result;
  };

  return (
    <section className="theme">
      {themedSlideData[category]?.map((item) => (
        <div className="theme-item-box" key={item.title}>
          <div className="item-title">
            <h2>{item.title}</h2>
            <p>{removeHashDuplication(item.hash)}</p>
            <p>{item.sigun}</p>
          </div>
          <ThemeSlide
            key={item.title}
            images={item.images}
            clickedElement={clickedElement}
            category={category}
          />
          <div className="item-text">
            <p>{item.sns}</p>
            <p>{item.text}</p>
            <a href={item.link!} rel="noreferrer" target="__blank">
              더 보기
            </a>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ThemePage;
