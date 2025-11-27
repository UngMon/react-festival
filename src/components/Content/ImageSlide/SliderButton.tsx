import { useState } from "react";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ButtonProps {
  currentIndex: number;
  setCurrentIndex: (value: number) => void;
  sliderRef: React.RefObject<HTMLDivElement>;
  imageLength: number;
}

const SliderButton = ({
  currentIndex,
  setCurrentIndex,
  sliderRef,
  imageLength,
}: ButtonProps) => {
  /* disabled는 사용자가 슬라이드의 next, prev버튼의 광클을 방지하기 위한 state */
  const [disabled, setDisabled] = useState<boolean>(false);

  const buttonClickHandler = (type: string, newIndex: number) => {
    if (disabled) return;
    if (imageLength === 2 && (newIndex > 1 || newIndex < 0)) return;

    setDisabled(true);
    setCurrentIndex(newIndex);
    sliderRef.current!.style.transition = "transform 250ms ease";

    setTimeout(() => {
      sliderRef.current!.style.transition = "";
      setDisabled(false);

      if (imageLength === 2) return; // 2개의 이미지는 아래와 같이 이미지 위치 재조정이 필요 없음

      if (type === "prev" && currentIndex === 1)
        setCurrentIndex(Math.floor(imageLength / 3));

      if (
        type === "next" &&
        currentIndex === Math.floor((imageLength * 2) / 3) - 1
      )
        setCurrentIndex(Math.floor(imageLength / 3));
    }, 250);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => buttonClickHandler("prev", currentIndex - 1)}
        className="prev"
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <button
        type="button"
        onClick={() => buttonClickHandler("next", currentIndex + 1)}
        className="next"
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
};

export default SliderButton;
