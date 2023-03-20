import { ContentImage } from "../../modules/Type";
import { useEffect, useState } from "react";

interface ButtonProps {
  currentIndex: number;
  setCurrentIndex: (value: number) => void;
  sliderRef: React.RefObject<HTMLDivElement>;
  imageData: ContentImage[];
}

const SliderButton = ({
  currentIndex,
  setCurrentIndex,
  sliderRef,
  imageData,
}: ButtonProps) => {
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (disabled) {
      timer = setTimeout(() => {
        sliderRef.current!.style.transition = "transform 300ms ease";
        setDisabled(false);
      }, 320);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [disabled, sliderRef]);

  const prevClickHandler = () => {
    if (!disabled) {
      setDisabled(true);

      setCurrentIndex(currentIndex - 1);

      if (currentIndex === 1) {
        setTimeout(() => {
          setCurrentIndex(imageData.length);
          sliderRef.current!.style.transition = "";
        }, 300);
      }
    }
  };

  const nextClickHandler = () => {
    if (!disabled) {
      setDisabled(true);

      setCurrentIndex(currentIndex + 1);

      if (currentIndex === 2 * imageData.length - 1) {
        setTimeout(() => {
          setCurrentIndex(imageData.length);
          sliderRef.current!.style.transition = "";
        }, 300);
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
