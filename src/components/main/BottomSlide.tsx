import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BottomSlide.css";

const bottom = [
  {
    title: "이색 카페",
    text: "평범하지 않는 MZ 취향 저격 카페",
    color: "linear-gradient(180deg, #b6cdff, #edf1f4)",
    url: "/images/bottom/cafe.jpeg",
  },
  {
    title: "문화공간",
    text: "독특한 12개의 박물관과 문화공간",
    color: "yellow",
    url: "/images/bottom/culture.jpg",
  },
  {
    title: "플래그쉽 스토어",
    text: "트랜디한 플래그쉽 스토어",
    color: "gray",
    url: "/images/bottom/plagship.jpeg",
  },
  {
    title: "뮤직 스토어",
    text: "음악을 사랑하는 이들에게",
    color: "beige",
    url: "/images/bottom/musicplate.jpeg",
  },
  {
    title: "서울의 Bar",
    text: "서울의 9가지 Bar",
    color: "beige",
    url: "/images/bottom/bar.jpeg",
  },
];

const BottomSlide = () => {
  const navigate = useNavigate();
  console.log("Rendring");
  const JSXArray = [...bottom, ...bottom, ...bottom];

  const [cardNumber, setCardNumber] = useState<number>(bottom.length);
  const [distance, setDistance] = useState<number>(0);

  const slideRef = useRef<HTMLUListElement>(null);
  const liRef = useRef<HTMLLIElement>(null);
  const imageBoxRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (window.innerWidth >= 1024) return;

    const slideBoxWidth: number =
      window.innerWidth >= 1200 ? 1200 : window.innerWidth;

    let newDistance: number =
      bottom.length * liRef.current!.clientWidth -
      (slideBoxWidth - imageBoxRef.current![bottom.length]!.clientWidth) / 2;

    setDistance(newDistance);
  }, []);

  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth > 1024) return;

      const slideBoxWidth: number = window.innerWidth;
      // window.innerWidth >= 1200 ? 1200 : window.innerWidth;

      let pickedCardWidth = 0.5625 * window.innerWidth + 60;
      if (pickedCardWidth > 280) pickedCardWidth = 280;
      else if (pickedCardWidth < 240) pickedCardWidth = 240;

      let newDistance: number =
        cardNumber * liRef.current!.clientWidth -
        (slideBoxWidth - pickedCardWidth) / 2;

      setDistance(newDistance);
    };

    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  });

  const cardClickHandler = (index: number) => {
    if (index === cardNumber) return;
    const cardWidth: number = liRef.current!.clientWidth;
    const NewCardNumber: number =
      index > cardNumber ? cardNumber + 1 : cardNumber - 1;

    slideRef.current!.style.transition = "all 300ms ease";
    imageBoxRef.current![cardNumber]!.style.transition = "all 300ms ease";
    imageBoxRef.current![NewCardNumber]!.style.transition = "all 300ms ease";

    setCardNumber(NewCardNumber);
    setDistance(
      index > cardNumber ? distance + cardWidth : distance - cardWidth
    );

    if (
      NewCardNumber === bottom.length - 1 ||
      NewCardNumber === bottom.length * 2
    ) {
      setTimeout(() => {
        let idx =
          NewCardNumber === bottom.length - 1
            ? NewCardNumber + bottom.length
            : NewCardNumber - bottom.length;

        slideRef.current!.style.transition = "";
        imageBoxRef.current![idx]!.style.transition = "";
        imageBoxRef.current![NewCardNumber]!.style.transition = "";

        let newDistance =
          NewCardNumber === bottom.length - 1
            ? distance + cardWidth * (bottom.length - 1)
            : distance - cardWidth * (bottom.length - 1);

        setCardNumber(idx);
        setDistance(newDistance);
      }, 300);
    }
  };

  const defineStyle = (index: number) => {
    const style = {
      marginTop: "0px",
    };

    if (index % 2 === 0) {
    }

    return {};
  };

  return (
    <section className="bottom-slide-container">
      <div className="bottom-slide-box">
        <div id="소제목">
          <div>
            <span>Content</span>
          </div>
          <div />
        </div>
        {/* <h3>혼자 가기엔 아까운 장소!</h3> */}
        {/* <div className="bottom-item-text-box">
          <p>{bottom[cardNumber % bottom.length].text}</p>
          <button
            onClick={() =>
              navigate(`/pick?theme=${cardNumber % bottom.length}`)
            }
          >
            더 보기
          </button>
        </div> */}
        <div className="bottom-slide">
          <ul
            id="slide-box"
            ref={slideRef}
            style={{
              transform:
                window.innerWidth < 1024 ? `translateX(${-distance}px)` : "",
            }}
          >
            {window.innerWidth >= 1024 &&
              bottom.map((item, index) => (
                <li key={index} ref={liRef}>
                  <div
                    className="bottom-item"
                    ref={(el: HTMLDivElement) =>
                      (imageBoxRef.current![index] = el)
                    }
                    style={{
                      marginTop: index % 2 === 0 ? "0" : "20px",
                    }}
                  >
                    <img src={item.url} alt={item.title} />
                  </div>
                </li>
              ))}
            {window.innerWidth < 1024 &&
              JSXArray.map((item, index) => {
                return (
                  <li
                    key={index}
                    ref={liRef}
                    onClick={() => cardClickHandler(index)}
                  >
                    <div
                      className="bottom-item"
                      ref={(el: HTMLDivElement) =>
                        (imageBoxRef.current![index] = el)
                      }
                      style={{
                        padding: index !== cardNumber ? "10px" : "0 30px",
                        opacity: index !== cardNumber ? "0.6" : "1",
                        width:
                          index !== cardNumber
                            ? "clamp(120px, 37.5vw, 170px)"
                            : "clamp(180px, 56.25vw, 220px)",
                        height:
                          index !== cardNumber
                            ? "clamp(170px, 53.125vw, 220px)"
                            : "clamp(220px, 68.75vw, 270px)",
                      }}
                    >
                      <img src={item.url} alt={item.title} />
                    </div>
                  </li>
                );
              })}
          </ul>
          {window.innerWidth < 1024 && (
            <div className="bottom-button">
              <div>
                <button onClick={() => cardClickHandler(cardNumber - 1)}>
                  {"<"}
                </button>
              </div>
              <div>
                <button onClick={() => cardClickHandler(cardNumber + 1)}>
                  {">"}
                </button>
              </div>
            </div>
          )}
        </div>
        {window.innerWidth < 1024 && (
          <div className="count-circle">
            {bottom.map((_, index) => (
              <div
                key={index}
                style={{
                  backgroundColor:
                    index === cardNumber % bottom.length
                      ? "rgb(168, 168, 168)"
                      : "",
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BottomSlide;
