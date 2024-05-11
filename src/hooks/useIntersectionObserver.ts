import { useRef, useState, useEffect } from "react";

const useIntersectionObserver = (
  dataLoading: boolean
): [
  React.RefObject<HTMLDivElement>,
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [intersecting, SetIntersecting] = useState<boolean>(false);

  useEffect(() => {
    let target = targetRef.current!;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (dataLoading) return;

        if (!entries[0].isIntersecting && intersecting) SetIntersecting(false);

        //   console.log("IS Not INTERSECTING");

        if (entries[0].isIntersecting && !intersecting) SetIntersecting(true);

        //   console.log("IS INTERSECTING");
      },
      {
        // options
        root: null,
        rootMargin: "0px",
        threshold: 1,
      }
    );

    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [intersecting, dataLoading]);

  return [targetRef, intersecting, SetIntersecting];
};

export default useIntersectionObserver;
