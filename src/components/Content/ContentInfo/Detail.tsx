import { useEffect, useState } from "react";
import {
  ResponCommon,
  ResponInfo,
  ResponIntro,
  GetContentData,
} from "../../../type/ContentType";
import { useAppDispatch } from "../../../redux/store";
import { dataActions } from "../../../redux/data-slice";
import { convertText } from "../../../utils/convertText";
import BasicInfo from "./BasicInfo";
import Map from "./Map";
import Loading from "../../loading/Loading";
import getContentData from "../../../utils/getContentData";
import "./Detail.css";

interface DetailProps {
  infoRef: React.RefObject<HTMLHeadingElement>;
  content_id: string;
  type: string;
}

type Datas = {
  common: ResponCommon;
  info: ResponInfo;
  intro: ResponIntro;
};

const Detail = ({ infoRef, content_id, type }: DetailProps) => {
  console.log("Detail Component Render");
  const dispatch = useAppDispatch();
  const [data, setContentData] = useState<Datas>();
  const detailInfo = data?.info.response.body.items.item,
    detailIntro = data?.intro.response.body.items.item,
    detailCommon = data?.common.response.body.items.item;

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const settingContentData = async (type: string, contentId: string) => {
      try {
        const response: GetContentData = await getContentData(type, contentId);
        setContentData({
          info: response.contentInfo,
          intro: response.contentIntro,
          common: response.contentCommon,
        });
        dispatch(
          dataActions.setConentInfo({
            title: response.contentCommon.response.body.items.item[0].title,
          })
        );
      } catch (error: any) {
        setLoading(false);
        throw Error(`error is ocurred! ${error.message}`);
      }

      setLoading(false);
    };
    settingContentData(type, content_id);
  }, [dispatch, type, content_id]);

  return (
    <div className="Cotent-text-box" ref={infoRef}>
      {loading && (
        <div style={{ height: 500 }}>
          <Loading />
        </div>
      )}
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
          type={type}
        />
      )}
    </div>
  );
};

export default Detail;
