import { useState, useRef } from "react";
import { ContentImage } from "../../modules/Type";
import NoImage from "../../Images/NoImage.png";
import './Slider.css';

interface SliderProps {
  image: ContentImage[];
}

const Slider = ({ image }: SliderProps) => {
  const ulRef = useRef<HTMLUListElement>(null);
  const [count, setCount] = useState<number>(1);
  const [translate, setTransLate] = useState<number>(0);

  const buttonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const type = event.currentTarget.textContent;
    let transLateX = translate;

    if (type === "<") {
      if (count === 1) return;
      transLateX += ulRef.current!.clientWidth;
      ulRef.current!.style.transform = `translateX(${transLateX}px)`;
      setCount(count - 1);
    }

    if (type === ">") {
      if (count === image.length) return;
      transLateX -= ulRef.current!.clientWidth;
      ulRef.current!.style.transform = `translateX(${transLateX}px)`;
      setCount(count + 1);
    }
    setTransLate(transLateX);
  };

  return (
    <div className="Content-image-slider">
      <button type="button" onClick={(e) => buttonClickHandler(e)}>
        {"<"}
      </button>
      <div className="slider-box">
        <ul className="slider" ref={ulRef}>
          {image ? (
            image.map((item) => (
              <li key={item.originimgurl}>
                <img src={item.originimgurl} alt="축제 사진"></img>
              </li>
            ))
          ) : (
            <li>
              <img src={NoImage} alt="축제 이미지"></img>
            </li>
          )}
        </ul>
      </div>
      <button type="button" onClick={(e) => buttonClickHandler(e)}>
        {">"}
      </button>
    </div>
  );
};

export default Slider;
