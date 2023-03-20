import { ContentImage } from "../../modules/Type";
import React, { useEffect, useState } from "react";

interface ButtonProps {
  currentIndex: number;
  setCurrentIndex: (value: number) => void;
  sliderRef: React.RefObject<HTMLDivElement>;
  imageData: ContentImage[];
  isMouseOver: boolean;
}

const SliderButton = ({
  currentIndex,
  setCurrentIndex,
  sliderRef,
  imageData,
  isMouseOver,
}: ButtonProps) => {
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!disabled && !isMouseOver) {
      timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        sliderRef.current!.style.transition = "transform 300ms ease";
        if (currentIndex === 2 * imageData.length - 1) {
          setTimeout(() => {
            setCurrentIndex(imageData.length);
            sliderRef.current!.style.transition = "";
          }, 300);
        }
      }, 3000);
    }

    if (disabled) {
      if (currentIndex !== imageData.length) {
        timer = timer = setTimeout(() => {
          setDisabled(false);
          sliderRef.current!.style.transition = "transform 250ms ease";
        }, 500);
      } else {
        timer = setTimeout(() => {
          setDisabled(false);
          sliderRef.current!.style.transition = "transform 250ms ease";
        }, 250);
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [
    disabled,
    sliderRef,
    currentIndex,
    imageData,
    setCurrentIndex,
    isMouseOver,
  ]);

  const prevClickHandler = () => {
    if (!disabled) {
      setCurrentIndex(currentIndex - 1);
      setDisabled(true);

      if (currentIndex === 1) {
        setTimeout(() => {
          setCurrentIndex(imageData.length);
          sliderRef.current!.style.transition = "";
        }, 250);
      }
    }
  };

  const nextClickHandler = () => {
    if (!disabled) {
      setCurrentIndex(currentIndex + 1);
      setDisabled(true);

      if (currentIndex === 2 * imageData.length - 1) {
        setTimeout(() => {
          setCurrentIndex(imageData.length);
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
