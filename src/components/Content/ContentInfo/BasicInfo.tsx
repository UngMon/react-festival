import { ContentCommon, ContentIntro } from "../../../type/FestivalType";
import { key } from "../../../type/Common";
import { dateSlice } from "../../../utils/DateSlice";

interface BasicProps {
  detailIntro: ContentIntro[];
  detailCommon: ContentCommon[];
  type: string;
}

const BasicInfo = ({ detailIntro, detailCommon, type }: BasicProps) => {
  const Intro: { [key: string]: string } = detailIntro[0];

  return (
    <div className="Cotent-deatail">
      <ul className="Content-table">
        {detailCommon[0].tel && (
          <li>
            <strong className="label">문의 및 안내</strong>
            <span
              dangerouslySetInnerHTML={{ __html: detailCommon[0].tel }}
            ></span>
          </li>
        )}
        {detailCommon[0].zipcode && (
          <li>
            <strong className="label">우편번호</strong>
            <span
              dangerouslySetInnerHTML={{ __html: detailCommon[0].zipcode }}
            ></span>
          </li>
        )}
        {type === "15" && (
          <li>
            <strong className="label">기간</strong>
            <span
              dangerouslySetInnerHTML={{
                __html: dateSlice(
                  detailIntro[0].eventstartdate!,
                  detailIntro[0].eventenddate!
                ),
              }}
            ></span>
          </li>
        )}
        {key[type].map(
          (item) =>
            Intro[item[1]] && (
              <li key={item[0]}>
                <strong className="label">{item[0]}</strong>
                <span
                  dangerouslySetInnerHTML={{ __html: Intro[item[1]] }}
                ></span>
              </li>
            )
        )}
        {detailCommon[0].homepage && (
          <li>
            <strong className="label">홈페이지</strong>
            <span
              dangerouslySetInnerHTML={{ __html: detailCommon[0].homepage }}
            ></span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default BasicInfo;
