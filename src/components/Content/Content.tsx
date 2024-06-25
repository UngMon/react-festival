// import { Report } from "../../type/UserDataType";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Category } from "../../type/Common";
import Slider from "./contentImages/Slider";
import Detail from "./contentInfo/Detail";
import MenuBar from "./contentInfo/MenuBar";
import UserReviews from "./comments/UserReviews";
import Feelings from "./comments/Feelings";
import "./Content.css";

const Cotent = () => {
  // const [reportModal, setReportModal] = useState<Report>({
  //   open: false,
  //   when: "",
  //   userUid: "",
  //   name: "",
  //   text: "",
  // });

  const infoRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  const [param] = useSearchParams();
  const type: string = param.get("type")!;
  const contentId: string = param.get("contentId")!;
  const collectionName = Category[type];

  return (
    <main className="Content">
      <Slider type={type} contentId={contentId} />
      <MenuBar infoRef={infoRef} reviewRef={reviewRef} />
      <Detail infoRef={infoRef} contentId={contentId} type={type} />
      <section className="Content-Review">
        <Feelings collectionName={collectionName} contentId={contentId} />
        <UserReviews
          reviewRef={reviewRef}
          collectionName={collectionName}
          contentId={contentId}
        />
      </section>
    </main>
  );
};

export default Cotent;
