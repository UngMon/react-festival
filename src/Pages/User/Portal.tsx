// 더 깔끔한 최신형 Portal (DOM 생성을 리액트가 관리)
import { useState, useLayoutEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }: { children: ReactNode }) => {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(
    null,
  );

  useLayoutEffect(() => {
    // 모달을 담을 전용 div를 동적으로 생성
    let element = document.getElementById("portal-wrapper");
    let created = false;

    if (!element) {
      created = true;
      element = document.createElement("div");
      element.setAttribute("id", "portal-wrapper");
      document.body.appendChild(element);
    }
    setWrapperElement(element);

    // 언마운트 시 생성했던 div 제거
    return () => {
      if (created && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, []);

  if (!wrapperElement) return null;

  return createPortal(children, wrapperElement);
};

export default Portal;

