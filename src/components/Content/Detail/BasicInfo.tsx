import { ContentCommon, ContentIntro } from "type/ContentType";
import { BasicInfoList } from "assets/CatCode/CatCode";
import { dateSlice } from "utils/dateSlice";
import { convertText } from "utils/convertText";

interface BasicProps {
  detailIntro: ContentIntro[];
  detailCommon: ContentCommon[];
  content_type: string;
}

const BasicInfo = ({ detailIntro, detailCommon, content_type }: BasicProps) => {
  const Intro: { [key: string]: string } = detailIntro[0];

  const convertHtmlToText = (text: string) => {
    let result: [string, string][] = [];

    const anchorTagText = convertText(text).split("\n");

    for (const text of anchorTagText) {
      if (text.length === 0) continue;
      // '홈페이지 : <a href="https://~~~~"></a>에서 ':' 이전 텍스트와 href만을 구분하는 정규표현식.
      const match = text.match(/([^:]+) : <a href="([^"]+)"/);
      if (match) result.push([match[1], match[2]]);
    }
    return result;
  };

  const homepage = convertHtmlToText(detailCommon[0].homepage);

  return (
    <ul className="Content-table">
      {detailCommon[0].tel && (
        <li>
          <strong className="label">문의 및 안내</strong>
          <span>{convertText(detailCommon[0].tel)}</span>
        </li>
      )}
      {detailCommon[0].zipcode && (
        <li>
          <strong className="label">우편번호</strong>
          <span>{convertText(detailCommon[0].zipcode)}</span>
        </li>
      )}
      {content_type === "15" && (
        <li>
          <strong className="label">기간</strong>
          <span>
            {dateSlice(
              detailIntro[0].eventstartdate!,
              detailIntro[0].eventenddate!
            )}
          </span>
        </li>
      )}
      {BasicInfoList[content_type].map(
        (item) =>
          Intro[item[1]] && (
            <li key={item[0]}>
              <strong className="label">{item[0]}</strong>
              <span>{convertText(Intro[item[1]])}</span>
            </li>
          )
      )}
      {detailCommon[0].homepage.length > 0 && (
        <li>
          <strong className="label">홈페이지</strong>
          <span>
            {homepage.length > 0 ? (
              homepage.map((item, index) => (
                <div key={index}>
                  <a href={item[1]} target="_blank" rel="noreferrer">
                    {detailCommon[0].title}
                  </a>
                </div>
              ))
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: detailCommon[0].homepage }}
              ></div>
            )}
          </span>
        </li>
      )}
    </ul>
  );
};

export default BasicInfo;
