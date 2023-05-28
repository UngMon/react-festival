import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import "./Top.css";

const Top = () => {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [throttle, setThrottle] = useState<boolean>(false);

  const movingTopView = () => {
    window.scrollTo(0, 0);
    setVisible(false);
  };

  useEffect(() => {
    // 스로틀링을 통해 과도한 렌더링 방지
    if (throttle) return;

    // setTime에서 1초 간격으로 스로틀링의 상태를 변경한다.
    // 만약 사용자가 1500 px높이에서 스로틀링 때문에 top버튼이 사라지지 않을 경우, 
    // 버튼을 사라지게 만들어줌.
    if (isVisible && window.scrollY < 1500) setVisible(false);

    const scroll = () => {
      if (window.scrollY < 1500 && isVisible) {
        setVisible(false);
      }
      if (window.scrollY >= 1500 && !isVisible) {
        setVisible(true);
      }
      setThrottle(true);
      setTimeout(() => {
        setThrottle(false);
      }, 1000);
    };
    
     window.addEventListener("scroll", scroll);

    return () => window.removeEventListener("scroll", scroll);
  }, [isVisible, throttle]);

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
