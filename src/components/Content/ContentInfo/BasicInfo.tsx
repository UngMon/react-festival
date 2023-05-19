import { ContentDetailCommon, ContentDetailIntro } from "../../../type/FestivalType";
import { dataSlice } from "../../../utils/DataSlice";

interface BasicProps {
  detailIntro: ContentDetailIntro[];
  detailCommon: ContentDetailCommon[];
}

const BasicInfo = ({ detailIntro, detailCommon }: BasicProps) => {
  return (
    <table className="Content-table">
      <tbody>
        <tr key="기간">
          <th>기간</th>
          <td>
            {dataSlice(
              detailIntro[0].eventstartdate,
              detailIntro[0].eventenddate
            )}
          </td>
        </tr>
        <tr key="주최자 정보">
          <th>주최자 정보</th>
          <td>{detailIntro[0].sponsor1 || "정보 없음"}</td>
        </tr>
        <tr key="주최자 연락처">
          <th>주최자 연락처</th>
          <td>{detailCommon[0].tel}</td>
        </tr>
        <tr key="홈페이지">
          <th>홈페이지</th>
          <td
            dangerouslySetInnerHTML={{
              __html:
                detailIntro[0].eventhomepage ||
                detailCommon[0].homepage ||
                "정보없음",
            }}
          ></td>
        </tr>
        <tr key="이용요금">
          <th>이용요금</th>
          <td
            dangerouslySetInnerHTML={{
              __html: detailIntro[0].usetimefestival || "정보 없음",
            }}
          ></td>
        </tr>
        <tr key="공연시간">
          <th>공연시간</th>
          <td>{detailIntro[0].playtime || "정보 없음"}</td>
        </tr>
        <tr key="우편번호">
          <th>우편번호</th>
          <td>{detailCommon[0].zipcode}</td>
        </tr>
        <tr key="행사장소">
          <th>행사장소</th>
          <td>{detailIntro[0].eventplace || "정보 없음"}</td>
        </tr>
        <tr key="주소">
          <th>주소</th>
          <td>{detailCommon[0].addr1}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default BasicInfo;
