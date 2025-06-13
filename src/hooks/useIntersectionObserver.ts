import { useRef, useState, useEffect } from "react";

const useIntersectionObserver = (): [
  React.RefObject<HTMLDivElement>,
  boolean
] => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [intersecting, setIntersecting] = useState<boolean>(false);

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const isNowIntersecting = entries[0].isIntersecting;

        // if (!entries[0].isIntersecting) {
        //   console.log("here One");
        //   setIntersecting(false);
        // }

        // if (entries[0].isIntersecting) {
        //   console.log("here Two");
        //   setIntersecting(true);
        // }

        setIntersecting((prev) => {
          if (prev === isNowIntersecting) return prev; // 상태 안 바뀌면 업데이트 안 함
          return isNowIntersecting;
        });
      },
      {
        // options
        root: null,
        rootMargin: "0px",
        threshold: 1,
      }
    );

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [targetRef, intersecting];
};

export { useIntersectionObserver };
