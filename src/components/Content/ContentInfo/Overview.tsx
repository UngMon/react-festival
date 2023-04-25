import { ResponDetailCommon } from "../../../modules/Type";
import "./Overview.css";

interface OverviewProps {
  contentDetailCommon: ResponDetailCommon;
}

const Overview = ({ contentDetailCommon }: OverviewProps) => {
  const detailCommon = contentDetailCommon.response.body.items.item;

  return (
    <div className="Cotent-overview">
      <strong>개요</strong>
      <div className="overview-p">
        <p
          dangerouslySetInnerHTML={{
            __html: detailCommon[0].overview || "등록된 정보가 없습니다.",
          }}
        ></p>
      </div>
    </div>
  );
};

export default Overview;
