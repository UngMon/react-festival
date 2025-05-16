import { useRef, useState, useEffect } from "react";

const useIntersectionObserver = (
  dataLoading: boolean
): [
  React.RefObject<HTMLDivElement>,
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [intersecting, setIntersecting] = useState<boolean>(false);

  useEffect(() => {
    if (dataLoading || !targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        console.log(entries[0].isIntersecting);

        if (!entries[0].isIntersecting) {
          console.log("here One");
          // intersecting = false;
          setIntersecting(false);
        }

        if (entries[0].isIntersecting) {
          console.log("here Two");
          // intersecting = true;
          setIntersecting(true);
        }
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
  }, [dataLoading, intersecting]);

  return [targetRef, intersecting, setIntersecting];
};

export { useIntersectionObserver };
