import { useRef } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { slideData } from "../../assets/Theme/Theme";
import ThemeSlide from "./ThemeSlide";
import "./Theme.css";

const Theme = () => {
  const [param] = useSearchParams();
  const theme_number = param.get("theme");
  const clickedElement = useRef<HTMLElement | null>(null);
  
  if (!theme_number) return <Navigate to='/'/>;

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
      {theme_number &&
        slideData[Number(theme_number)].map((item, index) => (
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
              theme_number={theme_number}
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

export default Theme;
