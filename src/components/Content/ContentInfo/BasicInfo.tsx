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
            <strong>문의 및 안내</strong>
            <span>{detailCommon[0].tel}</span>
          </li>
        )}
        {detailCommon[0].addr1 && (
          <li>
            <strong>주소</strong>
            <span>{detailCommon[0].addr1}</span>
          </li>
        )}
        {detailCommon[0].zipcode && (
          <li>
            <strong>우편번호</strong>
            <span>{detailCommon[0].zipcode}</span>
          </li>
        )}
        {type === "15" && (
          <li>
            <strong>기간</strong>
            <span>
              {dateSlice(
                detailIntro[0].eventstartdate!,
                detailIntro[0].eventenddate!
              )}
            </span>
          </li>
        )}
        {key[type].map(
          (item) =>
            Intro[item[1]] && (
              <li key={item[0]}>
                <strong>{item[0]}</strong>
                <span
                  dangerouslySetInnerHTML={{ __html: Intro[item[1]] }}
                ></span>
              </li>
            )
        )}
        {detailCommon[0].homepage && (
          <li>
            <strong>홈페이지</strong>
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

/*{type === "12" && (
  <>
    <li>
      <strong>문의 및 안내</strong>
      <span>{detailIntro[0].infocenter}</span>
    </li>
    <li>
      <strong>휴일</strong>
      <span>{detailIntro[0].restdate}</span>
    </li>
    <li>
      <strong>개장시간</strong>
      <span>{detailIntro[0].usetime}</span>
    </li>
    <li>
      <strong>가이드</strong>
      <span>{detailIntro[0].expguide}</span>
    </li>
    <li>
      <strong>수용인원</strong>
      <span>{detailIntro[0].accomcount}</span>
    </li>
    <li>
      <strong>주차창</strong>
      <span>{detailIntro[0].parking}</span>
    </li>
    <li>
      <strong>반려동물입장</strong>
      <span>{detailIntro[0].chkpet}</span>
    </li>
  </>
)}
{type === "14" && (
  <>
    <li>
      <strong>문의 및 안내</strong>
      <span>{detailIntro[0].infocenterculture}</span>
    </li>
    <li>
      <strong>규모</strong>
      <span>{detailIntro[0].scale}</span>
    </li>
    <li>
      <strong>수용인원</strong>
      <span>{detailIntro[0].accomcountculture}</span>
    </li>
    <li>
      <strong>입장료</strong>
      <span>{detailIntro[0].usefee}</span>
    </li>
    <li>
      <strong>주차 여부</strong>
      <span>{detailIntro[0].parkingculture}</span>
    </li>
    <li>
      <strong>주차비용</strong>
      <span>{detailIntro[0].parkingfee}</span>
    </li>
    <li>
      <strong>휴일</strong>
      <span>{detailIntro[0].restdateculture}</span>
    </li>
    <li>
      <strong>반려동물입장</strong>
      <span>{detailIntro[0].chkpetculture}</span>
    </li>
  </>
)}
{type === "15" && (
  <>
    <li>
      <strong>개최장소</strong>
      <span>{detailIntro[0].eventplace}</span>
    </li>
    <li>
      <strong>연령제한</strong>
      <span>{detailIntro[0].agelimit}</span>
    </li>
    <li>
      <strong>프로그램</strong>
      <span>{detailIntro[0].program}</span>
    </li>
    <li>
      <strong>시작시간</strong>
      <span>{detailIntro[0].playtime}</span>
    </li>
    <li>
      <strong>이용료</strong>
      <span>{detailIntro[0].usetimefestival}</span>
    </li>
    <li>
      <strong>할인</strong>
      <span>{detailIntro[0].discountinfofestival}</span>
    </li>
    <li>
      <strong>소요시간</strong>
      <span>{detailIntro[0].spendtimefestival}</span>
    </li>
  </>
)}
{type === "25" && (
  <>
    <li key="안내">
      <strong>문의 및 안내</strong>
      <span>{detailIntro[0].infocentertourcours}</span>
    </li>
    <li key="안내">
      <strong>총 거리</strong>
      <span>{detailIntro[0].distance}</span>
    </li>
    <li key="안내">
      <strong>소요 시간</strong>
      <span>{detailIntro[0].taketime}</span>
    </li>
  </>
)} */

/* <div className="Cotent-deatail">
<table className="Content-table">
  <tbody>
    {detailCommon[0].tel && (
      <tr>
        <th>문의 및 안내</th>
        <td>{detailCommon[0].tel}</td>
      </tr>
    )}
    {detailCommon[0].addr1 && (
      <tr>
        <th>주소</th>
        <td>{detailCommon[0].addr1}</td>
      </tr>
    )}
    {detailCommon[0].addr1 && (
      <tr>
        <th>우편번호</th>
        <td>{detailCommon[0].zipcode}</td>
      </tr>
    )}
    {type === "12" && (
      <>
        <tr>
          <th>문의 및 안내</th>
          <td>{detailIntro[0].infocenter}</td>
        </tr>
        <tr>
          <th>휴일</th>
          <td>{detailIntro[0].restdate}</td>
        </tr>
        <tr>
          <th>개장시간</th>
          <td>{detailIntro[0].usetime}</td>
        </tr>
        <tr>
          <th>가이드</th>
          <td>{detailIntro[0].expguide}</td>
        </tr>
        <tr>
          <th>수용인원</th>
          <td>{detailIntro[0].accomcount}</td>
        </tr>
        <tr>
          <th>주차창</th>
          <td>{detailIntro[0].parking}</td>
        </tr>
        <tr>
          <th>반려동물입장</th>
          <td>{detailIntro[0].chkpet}</td>
        </tr>
      </>
    )}
    {type === "14" && (
      <>
        <tr>
          <th>문의 및 안내</th>
          <td>{detailIntro[0].infocenterculture}</td>
        </tr>
        <tr>
          <th>규모</th>
          <td>{detailIntro[0].scale}</td>
        </tr>
        <tr>
          <th>수용인원</th>
          <td>{detailIntro[0].accomcountculture}</td>
        </tr>
        <tr>
          <th>입장료</th>
          <td>{detailIntro[0].usefee}</td>
        </tr>
        <tr>
          <th>주차 여부</th>
          <td>{detailIntro[0].parkingculture}</td>
        </tr>
        <tr>
          <th>주차비용</th>
          <td>{detailIntro[0].parkingfee}</td>
        </tr>
        <tr>
          <th>휴일</th>
          <td>{detailIntro[0].restdateculture}</td>
        </tr>
        <tr>
          <th>반려동물입장</th>
          <td>{detailIntro[0].chkpetculture}</td>
        </tr>
      </>
    )}
    {type === "15" && (
      <>
        <tr>
          <th>개최장소</th>
          <td>{detailIntro[0].eventplace}</td>
        </tr>
        <tr>
          <th>연령제한</th>
          <td>{detailIntro[0].agelimit}</td>
        </tr>
        <tr>
          <th>프로그램</th>
          <td>{detailIntro[0].program}</td>
        </tr>
        <tr>
          <th>이용료</th>
          <td>{detailIntro[0].usetimefestival}</td>
        </tr>
        <tr>
          <th>할인정보</th>
          <td>{detailIntro[0].discountinfofestival}</td>
        </tr>
        <tr>
          <th>소요시간</th>
          <td>{detailIntro[0].spendtimefestival}</td>
        </tr>
      </>
    )}
    {type === "25" && (
      <>
        <tr key="안내">
          <th>문의 및 안내</th>
          <td>{detailIntro[0].infocentertourcours}</td>
        </tr>
        <tr key="안내">
          <th>총 거리</th>
          <td>{detailIntro[0].distance}</td>
        </tr>
        <tr key="안내">
          <th>소요 시간</th>
          <td>{detailIntro[0].taketime}</td>
        </tr>
      </>
    )}
    <tr>
      <th>홈페이지</th>
      <td>{detailCommon[0].homepage}</td>
    </tr>
  </tbody>
</table>
</div> */
