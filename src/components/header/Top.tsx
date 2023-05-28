import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import "./Top.css";

const Top = () => {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [movingToTop, setMovingToTop] = useState<boolean>(false);

  const movingTopView = () => {
    if (!movingToTop) {
      window.scrollTo(0, 0);

      setVisible(false);
      setMovingToTop(true);

      setTimeout(() => {
        setMovingToTop(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const scroll = () => {
      if (window.scrollY < 1500 && isVisible) setVisible(false);
      if (window.scrollY > 1500 && !isVisible) setVisible(true);
      console.log(window.scrollY);
    };

    if (!movingToTop) window.addEventListener("scroll", scroll);

    return () => window.removeEventListener("scroll", scroll);
  });

  return (
    <>
      {isVisible && (
        <div className="top-button-box" onClick={movingTopView}>
          <FontAwesomeIcon icon={faCaretUp} id="triangle" />
          <div>Top</div>
        </div>
      )}
    </>
  );
};

export default Top;
