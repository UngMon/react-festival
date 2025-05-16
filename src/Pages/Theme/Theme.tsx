import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { slideData } from "../../type/ThemeData";
import ThemeSlide from "./ThemeSlide";
import "./Theme.css";

const Theme = () => {
  const navigate = useNavigate();
  const [param] = useSearchParams();
  const theme_number = param.get("theme");
  const clickedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!theme_number) {
      navigate("/");
    }
  }, [navigate, theme_number]);
  console.log(slideData);

  const removeHashDuplication = (hash: string) => {
    const regex = /#([^#]+)/g;

    let match;
    let result = "";
    const rawTags = [];

    while ((match = regex.exec(hash)) !== null) {
      console.log(match)
      rawTags.push(match[0]);
    }

    const array = [...new Set(rawTags)];

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
              index={index}
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
