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
  /* disabled는 사용자가 슬라이드의 next, prev버튼의 광클을 방지하기 위한 state */
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    /* 자동슬라이드 
    사용자가 이미지 슬라이드에 마우스를 올려놓지 않은 상태에서 작동
    또한 사용자가 prev, next 버튼을 누르지 않은 경우에서 작동*/
    if (!disabled && !isMouseOver) {
      timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        sliderRef.current!.style.transition = "transform 250ms ease";
        /* 자동슬라이드는 next방향으로 움직이기 때문에 currentIndex가 아래의 조건을
        만족한 경우에서만 작동하면 된다.*/
        if (currentIndex === imageLength) {
          setTimeout(() => {
            setCurrentIndex(1);
            sliderRef.current!.style.transition = "";
          }, 250);
        }
      }, 3000);
    }

    /* 버튼 슬라이드 작동 로직
    사용자가 prev, next를 클릭할시에 disable는 true로 변경되어 렌더링 발생
    -> useEffect의 디펜던시에 의해 아래의 코드가 작동*/
    if (disabled) {
      if (currentIndex === 1 || currentIndex === imageLength) {
        // console.log(`250 세컨즈 ${currentIndex}`);
        timer = setTimeout(() => {
          setDisabled(false);
          sliderRef.current!.style.transition = "transform 250ms ease";
        }, 250);
      } else {
        // console.log(`500 세컨즈 ${currentIndex}`);
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
      setDisabled(true);
      setCurrentIndex(currentIndex - 1);
      if (currentIndex === 1) {
        setTimeout(() => {
          setCurrentIndex(imageLength);
          sliderRef.current!.style.transition = "";
        }, 250);
      }
    }
  };

  const nextClickHandler = () => {
    if (!disabled) {
      setCurrentIndex(currentIndex + 1);
      setDisabled(true);
      console.log('????????????')
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
        {`<`}
      </button>
      <button type="button" onClick={nextClickHandler} className="next">
        {`>`}
      </button>
    </div>
  );
};

export default SliderButton;
