import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ContentIdCode } from "../../type/FetchType";
import Slider from "./contentImages/Slider";
import Detail from "./contentInfo/Detail";
import MenuBar from "./contentInfo/MenuBar";
import UserReviews from "./comments/UserReviews";
import Feelings from "./feel/Feelings";
import "./Content.css";

const Cotent = () => {
  const infoRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  console.log('Content Rendering')
  const [param] = useSearchParams();
  const content_type: string = param.get("contentTypeId")!;
  const content_id: string = param.get("contentId")!;
  const collectionName = ContentIdCode[content_type];


  return (
    <main className="Content">
      <Slider content_id={content_id} />
      <MenuBar infoRef={infoRef} reviewRef={reviewRef} />
      <Detail
        infoRef={infoRef}
        content_id={content_id}
        content_type={content_type}
      />
      <section className="Content-Review">
        <Feelings collectionName={collectionName} content_id={content_id} />
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
