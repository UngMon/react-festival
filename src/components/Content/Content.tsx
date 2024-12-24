import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
// import { ContentIdCode } from "../../type/Common";
import Slider from "./contentImages/Slider";
import Detail from "./contentInfo/Detail";
import MenuBar from "./contentInfo/MenuBar";
import UserReviews from "./comments/UserReviews"; 
import Feelings from "./feel/Feelings";
import "./Content.css";

const Cotent = () => {
  console.log('Cotent Component Render')
  const infoRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  const [param] = useSearchParams();
  const type: string = param.get("type")!;
  const content_id: string = param.get("contentId")!;
  // const collectionName = ContentIdCode[type];
  const content_type: string = param.get('type')!;

  return (
    <main className="Content">
      {/* <Slider type={type} contentId={contentId} />
      <MenuBar infoRef={infoRef} reviewRef={reviewRef} />
      <Detail infoRef={infoRef} contentId={contentId} type={type} /> */}
      <section className="Content-Review">
        {/* <Feelings collectionName={collectionName} contentId={contentId} /> */}
        <UserReviews
          reviewRef={reviewRef}
          content_type={content_type}
          content_id={content_id}
        />
      </section>
    </main>
  );
};

export default Cotent;
