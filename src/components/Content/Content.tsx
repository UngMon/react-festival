import React, { useEffect, useRef } from "react";
import { defer, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { LoaderData, ResponImage, ResponDetail } from "../../modules/Type";
import "./Content.css";

const Cotent = () => {
  const ulRef = useRef<HTMLUListElement>(null);
  const { contentData, contentImage } = useLoaderData() as LoaderData;

  const detail = contentData.response.body.items.item;
  const image = contentImage.response.body.items.item;

  let translate = 0;

  // const buttonClickHandler = (event: React.MouseEvent) => {
  //   const type = event.currentTarget.textContent;
  //   if (type === "<") {
  //     console.log("?");
  //     translate -= ulRef.current!.clientWidth;
  //     ulRef.current!.style.transform = `translateX(${translate}px)`;
  //   }

  //   if (type === ">") {
  //     translate += ulRef.current!.clientWidth;
  //     ulRef.current!.style.transform = `translateX(${translate}px)`;
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("click", buttonClickHandler);
  //   return () => {
  //     window.removeEventListener("click", buttonClickHandler);
  //   };
  // });

  return (
    <main className="main-box">
      <div className="Content">
        <div className="Content-image-slider">
          <button type="button" onClick={(e) => buttonClickHandler(e)}>
            {"<"}
          </button>
          <ul className="slider" ref={ulRef}>
            {image.map((item) => (
              <li>
                <img
                  key={item.originimgurl}
                  src={item.originimgurl}
                  alt="축제 사진"
                ></img>
              </li>
            ))}
          </ul>
          <button type="button" onClick={(e) => buttonClickHandler(e)}>
            {">"}
          </button>
        </div>
        <div className="Content-info"></div>
        <div className="Content-script">
          <span></span>
        </div>
      </div>
    </main>
  );
};

export default Cotent;
const serviceKey = encodeURIComponent(process.env.REACT_APP_SERVICE_KEY!);

async function getContentImage(id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailImage1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${id}&imageYN=Y&subImageYN=Y&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }
  const data: ResponImage = await response.json();
  return data;
}

async function getContentDetail(id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailIntro1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${id}&contentTypeId=15&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }

  const data: ResponDetail = await response.json();
  return data;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const contentId = params.contentId;
  const contentData = await getContentDetail(contentId!);
  const contentImage = await getContentImage(contentId!);
  return defer({ contentData, contentImage });
}
