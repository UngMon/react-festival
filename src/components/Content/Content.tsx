import React, { useRef, useState } from "react";
import { defer, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { LoaderData, ResponImage, ResponDetail } from "../../modules/Type";
import "./Content.css";

const Cotent = () => {
  const ulRef = useRef<HTMLUListElement>(null);
  const { contentData, contentImage } = useLoaderData() as LoaderData;

  const detail = contentData.response.body.items.item;
  const image = contentImage.response.body.items.item;
  console.log(detail);
  console.log(image);
  const [count, setCount] = useState<number>(1);
  const [translate, setTransLate] = useState<number>(0);

  const buttonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const type = event.currentTarget.textContent;
    let transLateX = translate;

    if (type === "<") {
      if (count === 1) return;
      transLateX += ulRef.current!.clientWidth;
      ulRef.current!.style.transform = `translateX(${transLateX}px)`;
      setCount(count - 1);
    }

    if (type === ">") {
      if (count === image.length) return;
      transLateX -= ulRef.current!.clientWidth;
      ulRef.current!.style.transform = `translateX(${transLateX}px)`;
      setCount(count + 1);
    }
    setTransLate(transLateX);
  };

  return (
    <main className="main-box">
      <div className="Content">
        <div className="Content-image-slider">
          <button type="button" onClick={(e) => buttonClickHandler(e)}>
            {"<"}
          </button>
          <div className="slider-box">
            <ul className="slider" ref={ulRef}>
              {image !== undefined &&
                image.map((item) => (
                  <li key={item.originimgurl}>
                    <img src={item.originimgurl} alt="축제 사진"></img>
                  </li>
                ))}
              {image === undefined && (
                <li>
                  <img src="./Noimage.png" alt="축제 이미지"></img>
                </li>
              )}
            </ul>
          </div>
          <button type="button" onClick={(e) => buttonClickHandler(e)}>
            {">"}
          </button>
        </div>
        <div className="Content-info">
          <div className="Cotent-category">
            <div>기본정보</div>
            <div>이용안내</div>
            <div>지도</div>
          </div>
          <div className="Cotent-deatail">
            {
              <ul>
                <li>기간</li>
                <li>전화번호</li>
                <li>이용요금</li>
                <li>홈페이지</li>
                <li>주소</li>
              </ul>
            }
          </div>
        </div>
        <div className="Cotent-summary">
          <strong>개요</strong>
          <p></p>
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
