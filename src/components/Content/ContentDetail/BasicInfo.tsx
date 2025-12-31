import { ContentCommon, ContentIntro } from "types/ContentType";
import { BasicInfoList } from "assets/CatCode/CatCode";
import { dateSlice } from "utils/dateSlice";
import { convertText } from "utils/convertText";
import "./BasicInfo.css";

export interface LinkItem {
  title: string;
  url: string;
}

interface T {
  detailIntro: ContentIntro[];
  detailCommon: ContentCommon[];
  content_type: string;
}

const BasicInfo = ({ detailIntro, detailCommon, content_type }: T) => {
  const { zipcode, tel, title, homepage } = detailCommon[0];
  const { eventstartdate, eventenddate } = detailIntro[0];

  const Intro: { [key: string]: string } = detailIntro[0];

  const extractLinks = (htmlString: string) => {
    if (!htmlString) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // 모든 a 태그를 찾는다.
    const anchors = doc.querySelectorAll("a");
    const results: LinkItem[] = [];

    anchors.forEach((a) => {
      let anchor_title = title;
      const url = a.href;

      // 핵심 로직: a태그 바로 앞에 있는 형제 노드(previousSibling)가 텍스트인지 확인
      const prevNode = a.previousSibling;

      // 바로 앞 노드가 텍스트이고, 공백을 제거했을 때 내용이 있다면 그 내용을 타이틀로 사용
      if (
        prevNode &&
        prevNode.nodeType === Node.TEXT_NODE &&
        prevNode.textContent?.trim()
      ) {
        anchor_title = prevNode.textContent.trim();
      }

      results.push({ title: anchor_title, url });
    });

    return results;
  };

  const homepage_links = extractLinks(homepage);

  return (
    <ul className="Content-table">
      {tel && (
        <li>
          <strong className="label">문의 및 안내</strong>
          <span>{convertText(tel)}</span>
        </li>
      )}
      {zipcode && (
        <li>
          <strong className="label">우편번호</strong>
          <span>{convertText(zipcode)}</span>
        </li>
      )}
      {content_type === "15" && (
        <li>
          <strong className="label">기간</strong>
          <span>{dateSlice(eventstartdate!, eventenddate!)}</span>
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
      {homepage_links.length > 0 && (
        <li>
          <strong className="label">홈페이지</strong>
          <span>
            {homepage_links.map((item, index) => (
              <div key={index}>
                <a
                  className="hompage_link"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.title}
                </a>
              </div>
            ))}
          </span>
        </li>
      )}
    </ul>
  );
};

export default BasicInfo;
