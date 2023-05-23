import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { ContentData } from "../../type/UserData";
import { firebaseActions } from "../../redux/firebase-slice";
import {
  ResponImage,
  ResponDetailIntro,
  ResponDetailCommon,
} from "../../type/FestivalType";
import Slider from "./contentImages/Slider";
import Detail from "./contentInfo/Detail";
import ContentReviews from "./contentReview/ContentReviews";
import MenuBar from "./contentInfo/MenuBar";
import ReportModal from "./contentReview/modal/ReportModal";
import Loading from "../ui/loading/Loading";
import "./Content.css";

type Data = {
  contentDetailIntro: ResponDetailIntro;
  contentDetailCommon: ResponDetailCommon;
  contentImage: ResponImage;
};

const Cotent = () => {
  const [param] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const firebase = useSelector((state: RootState) => state.firebase);
  const [contentData, setContentData] = useState<Data>();
  console.log(contentData);
  const [category, setCategory] = useState<string>("기본정보");
  const [reportModalOpen, setReportModalOpen] = useState<
    [boolean, string, string, string, string]
  >([false, "", "", "", ""]);

  const menuBarRef = useRef<HTMLHeadingElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUserData = async (contentId: string) => {
      let docData: ContentData;
      const contentData = firebase.contentData;
      const contentRef = doc(db, "content", contentId);

      try {
        if (!contentData[contentId]) {
          // firestor contentId에 접근
          const contentUserData = (await getDoc(contentRef)).data();

          // fireStore에 해당 컨텐츠에 대한 정보가 없을 떄,
          if (!contentUserData) {
            docData = {
              comment: [],
              detailImage: [],
              firstImage: "",
              expression: {},
            };
            await setDoc(contentRef, docData);
          } else {
            docData = contentUserData as ContentData;
          }
          dispatch(firebaseActions.updateContentData({ docData, contentId }));
        }
      } catch (error: any) {
        console.log(error.message);
      }
      navigate(
        `/content/search?type=${param.get("type")}&contentId=${contentId}`
      );
    };

    const getContentData = async (type: string, contentId: string) => {
      try {
        const data = await loader(type, contentId!);
        getUserData(contentId);
        setContentData(data);
      } catch (error) {
        console.log(error);
      }
    };

    getContentData(param.get("type")!, param.get("contentId")!);
  }, [dispatch, firebase, param, navigate]);

  return (
    <main className="Content-box">
      {reportModalOpen[0] && (
        <ReportModal
          contentId={param.get("contentId")!}
          reportModalOpen={reportModalOpen}
          setReportModalOpen={setReportModalOpen}
        />
      )}
      <h2 className="Content-title">
        {contentData &&
          contentData!.contentDetailCommon.response.body.items.item[0].title}
      </h2>
      <div className="Content">
        <div className="slider-container">
          {!contentData && <Loading />}
          {contentData && <Slider contentImage={contentData.contentImage} />}
        </div>
        <div className="Content-menu-box">
          {contentData && (
            <MenuBar
              category={category}
              setCategory={setCategory}
              menuBarRef={menuBarRef}
              reviewRef={reviewRef}
            />
          )}
        </div>
        <div className="Content-detatil-area" ref={menuBarRef}>
          {!contentData && (
            <div style={{ height: 500 }}>
              <Loading />
            </div>
          )}
          {contentData && (
            <Detail
              category={category}
              contentDetailCommon={contentData.contentDetailCommon}
              contentDetailIntro={contentData.contentDetailIntro}
              type={param.get("type")!}
            />
          )}
        </div>
      </div>
      <ContentReviews
        contentId={param.get("contentId")!}
        reviewRef={reviewRef}
        setReportModalOpen={setReportModalOpen}
      />
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
  console.log(`getContentImage work ${data}`);
  return data;
}

async function getContentDetailIntro(type: string, id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailIntro1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${id}&contentTypeId=${type}&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }

  const data: ResponDetailIntro = await response.json();
  console.log(`loader getContentDetailIntro ${data}`);
  return data;
}

async function getCotentDetailCommon(type: string, id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${id}&contentTypeId=${type}&defaultYN=Y&firstImageYN=Y&areacodeYN=N&catcodeYN=N&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }

  const data: ResponDetailCommon = await response.json();
  console.log(`loader getDetailCommon ${data}`);
  return data;
}

export async function loader(type: string, contentId: string) {
  // { params }: LoaderFunctionArgs
  // console.log("loader work");
  // const contentId = params.contentId;
  const [contentImage, contentDetailIntro, contentDetailCommon] =
    await Promise.all([
      getContentImage(contentId!),
      getContentDetailIntro(type, contentId!),
      getCotentDetailCommon(type, contentId!),
    ]);

  return { contentDetailIntro, contentDetailCommon, contentImage };
}
