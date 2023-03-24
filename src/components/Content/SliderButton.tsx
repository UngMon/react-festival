import React, { useEffect, useState } from "react";

interface ButtonProps {
  currentIndex: number;
  setCurrentIndex: (value: number) => void;
  sliderRef: React.RefObject<HTMLDivElement>;
  imageLength: number;
  isMouseOver: boolean;
}

const SliderButton = ({
  currentIndex,
  setCurrentIndex,
  sliderRef,
  imageLength,
  isMouseOver,
}: ButtonProps) => {
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    /* 자동슬라이드 */
    if (!disabled && !isMouseOver) {
      timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        sliderRef.current!.style.transition = "transform 300ms ease";
        if (currentIndex === 2 * imageLength - 1) {
          setTimeout(() => {
            setCurrentIndex(imageLength);
            sliderRef.current!.style.transition = "";
          }, 300);
        }
      }, 3000);
    }
    /* 버튼 슬라이드 */
    if (disabled) {
      if (currentIndex === 1 || currentIndex === imageLength) {
        console.log(`250 세컨즈 ${currentIndex}`);
        timer = setTimeout(() => {
          setDisabled(false);
          sliderRef.current!.style.transition = "transform 250ms ease";
        }, 250);
      } else {
        console.log(`500 세컨즈 ${currentIndex}`);
        timer = setTimeout(() => {
          setDisabled(false);
          sliderRef.current!.style.transition = "transform 250ms ease";
        }, 500);
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [
    disabled,
    sliderRef,
    currentIndex,
    imageLength,
    setCurrentIndex,
    isMouseOver,
  ]);

  const prevClickHandler = () => {
    if (!disabled) {
      console.log(`prev ${currentIndex}`);
      setDisabled(true);
      setCurrentIndex(currentIndex - 1);
      if (currentIndex === 1) {
        console.log("??????????");
        setTimeout(() => {
          setCurrentIndex(imageLength);
          sliderRef.current!.style.transition = "";
        }, 250);
      }
    }
  };

  const nextClickHandler = () => {
    if (!disabled) {
      console.log(`next ${currentIndex}`);
      setCurrentIndex(currentIndex + 1);
      setDisabled(true);
      if (currentIndex === imageLength) {
        setTimeout(() => {
          setCurrentIndex(1);
          sliderRef.current!.style.transition = "";
        }, 250);
      }
    }
  };

  return (
    <div>
      <button type="button" onClick={prevClickHandler} className="prev">
        Prev
      </button>
      <button type="button" onClick={nextClickHandler} className="next">
        Next
      </button>
    </div>
  );
};

export default SliderButton;
