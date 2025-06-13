import { useEffect, useState } from "react";
import { ContentDetailData } from "type/ContentType";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store/store";
import { contentActions } from "store/content-slice";
import { convertText } from "utils/convertText";
import { fetchContentData } from "api/fetchContentData";
import BasicInfo from "./BasicInfo";
import Map from "./Map";
import Loading from "components/Loading/Loading";
import "./Detail.css";

interface DetailProps {
  infoRef: React.RefObject<HTMLHeadingElement>;
  content_id: string;
  content_type: string;
}

const Detail = ({ infoRef, content_id, content_type }: DetailProps) => {
  console.log("Detail Component Render");
  const dispatch = useAppDispatch();
  const { detailCommon, detailInfo, detailIntro } = useSelector(
    (state: RootState) => state.content
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (contentTypeId: string, contentId: string) => {
      try {
        const response: ContentDetailData = await fetchContentData(
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
      } finally {
        setLoading(false);
      }
    };
    fetchData(content_type, content_id);
  }, [dispatch, content_type, content_id]);

  return (
    <div className="Cotent-text-box" ref={infoRef}>
      {!loading ? (
        !detailCommon && !detailInfo && !detailIntro ? (
          <div className="Content-get-error">
            데이터를 불러오는데 오류가 발생했습니다.
          </div>
        ) : (
          <>
            {detailCommon && (
              <div className="info">
                <strong className="infoname">제목</strong>
                <p className="infotext">{detailCommon[0].title}</p>
              </div>
            )}
            {detailInfo?.map((data, index) =>
              data.infotext ? (
                <div className="info" key={index}>
                  <strong className="infoname">{data.infoname}</strong>
                  <p className="infotext">{convertText(data.infotext)}</p>
                </div>
              ) : null
            )}
            {detailCommon && <Map detailCommon={detailCommon} />}
            {detailIntro && detailCommon && (
              <BasicInfo
                detailIntro={detailIntro}
                detailCommon={detailCommon}
                content_type={content_type}
              />
            )}
          </>
        )
      ) : (
        <Loading height="400px" />
      )}
    </div>
  );
};

export default Detail;
