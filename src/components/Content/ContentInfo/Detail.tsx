import { useEffect, useState } from "react";
import {
  ResponCommon,
  ResponInfo,
  ResponIntro,
  GetContentData,
} from "../../../type/ContentType";
import { RootState, useAppDispatch } from "../../../redux/store";
import { convertText } from "../../../utils/convertText";
import BasicInfo from "./BasicInfo";
import Map from "./Map";
import Loading from "../../loading/Loading";
import getContentData from "../../../utils/getContentData";
import "./Detail.css";
import { contentActions } from "../../../redux/content-slice";
import { useSelector } from "react-redux";

interface DetailProps {
  infoRef: React.RefObject<HTMLHeadingElement>;
  content_id: string;
  content_type: string;
}

type Datas = {
  common: ResponCommon;
  info: ResponInfo;
  intro: ResponIntro;
};

const Detail = ({ infoRef, content_id, content_type }: DetailProps) => {
  console.log("Detail Component Render");
  const dispatch = useAppDispatch();
  const { detailCommon, detailInfo, detailIntro } = useSelector(
    (state: RootState) => state.content
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const settingContentData = async (
      contentTypeId: string,
      contentId: string
    ) => {
      try {
        const response: GetContentData = await getContentData(
          contentTypeId,
          contentId
        );

        const { contentCommon, contentInfo, contentIntro } = response;

        dispatch(
          contentActions.setContentData({
            contentCommon,
            contentInfo,
            contentIntro,
          })
        );
      } catch (error: any) {
        setLoading(false);
        throw Error(`error is ocurred! ${error.message}`);
      }

      setLoading(false);
    };
    settingContentData(content_type, content_id);
  }, [dispatch, content_type, content_id]);

  return (
    <div className="Cotent-text-box" ref={infoRef}>
      {loading && <Loading height="400px" />}
      {!loading && !detailCommon && !detailInfo && !detailIntro && (
        <div className="Content-get-error">
          데이터를 불러오는데 오류가 발생했습니다.
        </div>
      )}
      {detailCommon && (
        <div className="info">
          <strong className="infoname">제목</strong>
          <p className="infotext">{detailCommon[0].title}</p>
        </div>
      )}
      {detailInfo && (
        <div className="overview">
          {detailInfo.map((data, index) => (
            <div className="info" key={index}>
              <strong className="infoname">{data.infoname}</strong>
              <p className="infotext">{convertText(data.infotext)}</p>
            </div>
          ))}
        </div>
      )}
      {detailCommon && <Map detailCommon={detailCommon} />}
      {detailIntro && detailCommon && (
        <BasicInfo
          detailIntro={detailIntro}
          detailCommon={detailCommon}
          content_type={content_type}
        />
      )}
    </div>
  );
};

export default Detail;
