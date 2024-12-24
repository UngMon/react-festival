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
  console.log(dataLoading);
  useEffect(() => {
    if (dataLoading) return;

    let target = targetRef.current!;
    console.log(dataLoading);
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (!entries[0].isIntersecting && intersecting) {
          console.log('here One')
          setIntersecting(false);
        }

        if (entries[0].isIntersecting && !intersecting) {
          console.log("here Two");
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

    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [intersecting, dataLoading]);

  return [targetRef, intersecting, setIntersecting];
};

export default useIntersectionObserver;
