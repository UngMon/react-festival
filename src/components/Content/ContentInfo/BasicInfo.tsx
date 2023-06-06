import {
  ContentDetailCommon,
  ContentDetailIntro,
} from "../../../type/FestivalType";
import { dataSlice } from "../../../utils/DataSlice";

interface BasicProps {
  detailIntro: ContentDetailIntro[];
  detailCommon: ContentDetailCommon[];
  type: string;
}

const BasicInfo = ({ detailIntro, detailCommon, type }: BasicProps) => {
  return (
    <>
      <strong className="Content-info-title">기본정보</strong>
      <table className="Content-table">
        <tbody>
          {type === "15" && (
            <tr key="기간">
              <th>
                <img src="/images/icons/timetable.png" alt="기간" width="40" />
              </th>
              <td>
                {dataSlice(
                  detailIntro[0].eventstartdate!,
                  detailIntro[0].eventenddate!
                )}
              </td>
            </tr>
          )}
          {detailCommon[0].tel && (
            <tr key="주최자 연락처">
              <th>
                <img src="/images/icons/phone.png" alt="문의 안내" width="40" />
              </th>
              <td>{detailCommon[0].tel}</td>
            </tr>
          )}
          {
            <tr key="홈페이지">
              <th>
                <img
                  src="/images/icons/website.png"
                  alt="이용요금"
                  width="40"
                />
              </th>
              <td
                dangerouslySetInnerHTML={{
                  __html:
                    detailIntro[0].eventhomepage ||
                    detailCommon[0].homepage ||
                    "정보없음",
                }}
              ></td>
            </tr>
          }
          {detailIntro[0].usetimefestival && (
            <tr key="이용요금">
              <th>
                <img src="/images/icons/money.png" alt="이용요금" width="40" />
              </th>
              <td
                dangerouslySetInnerHTML={{
                  __html: detailIntro[0].usetimefestival,
                }}
              ></td>
            </tr>
          )}
          {type === "15" && detailIntro[0].playtime && (
            <tr key="공연시간">
              <th>
                <img src="/images/icons/clock.png" alt="공연시간" width="40" />
              </th>
              <td
                dangerouslySetInnerHTML={{ __html: detailIntro[0].playtime }}
              ></td>
            </tr>
          )}
          {detailCommon[0].zipcode && (
            <tr key="우편번호">
              <th>
                <img src="/images/icons/postal.png" alt="우편번호" width="40" />
              </th>
              <td>{detailCommon[0].zipcode}</td>
            </tr>
          )}
          {detailCommon[0].addr1 && (
            <tr key="주소">
              <th>
                <img src="/images/icons/location.png" alt="주소" width="40" />
              </th>
              <td>{detailCommon[0].addr1}</td>
            </tr>
          )}
          {type === "12" && detailIntro[0].infocenter! && (
            <tr key="안내">
              <th>
                <img src="/images/icons/phone.png" alt="문의 안내" width="40" />
              </th>
              <td
                dangerouslySetInnerHTML={{ __html: detailIntro[0].infocenter }}
              ></td>
            </tr>
          )}
          {type === "12" && detailIntro[0].restdate! && (
            <tr key="휴일">
              <th>
                <img src="/images/icons/Closed.png" alt="휴일" width="40"></img>
              </th>
              <td
                dangerouslySetInnerHTML={{ __html: detailIntro[0].restdate }}
              ></td>
            </tr>
          )}
          {type === "12" && detailIntro[0].expguide! && (
            <tr key="체험안내">
              <th>
                <img
                  src="/images/icons/guide.png"
                  alt="체험안내"
                  width="40"
                ></img>
              </th>
              <td
                dangerouslySetInnerHTML={{
                  __html: detailIntro[0].expguide,
                }}
              ></td>
            </tr>
          )}
          {type === "12" && detailIntro[0].accomcount! && (
            <tr key="수용인원">
              <th>
                <img
                  src="/images/icons/crowd.png"
                  alt="수용인원"
                  width="40"
                ></img>
              </th>
              <td>{detailIntro[0].accomcount}</td>
            </tr>
          )}
          {type === "12" && detailIntro[0].usetime! && (
            <tr key="개장시간">
              <th>
                <img src="/images/icons/open.png" alt="개장" width="40" />
              </th>
              <td
                dangerouslySetInnerHTML={{ __html: detailIntro[0].usetime }}
              ></td>
            </tr>
          )}
          {type === "12" && detailIntro[0].parking! && (
            <tr key="주차">
              <th>
                <img src="/images/icons/parking.png" alt="주차" width="40" />
              </th>
              <td>{detailIntro[0].parking}</td>
            </tr>
          )}
          {type === "12" && detailIntro[0].chkpet! && (
            <tr key="반려동물입장">
              <th>
                <img src="/images/icons/animal.png" alt="반려동물" width="40" />
              </th>
              <td>{detailIntro[0].chkpet}</td>
            </tr>
          )}
          {type === "14" && detailIntro[0].usefee! && (
            <tr key="입장료">
              <th>입장료</th>
              <td
                dangerouslySetInnerHTML={{ __html: detailIntro[0].usefee }}
              ></td>
            </tr>
          )}
          {type === "14" && detailIntro[0].spendtime! && (
            <tr key="소요시간">
              <th>
                <img
                  src="/images/icons/save-time.png"
                  alt="소요시간"
                  width="35"
                />
              </th>
              <td>{detailIntro[0].spendtime}</td>
            </tr>
          )}
          {type === "14" && detailIntro[0].discountinfo! && (
            <tr key="할인">
              <th>
                <img src="/images/icons/discount.png" alt="할인" width="35" />
              </th>
              <td>{detailIntro[0].discountinfo}</td>
            </tr>
          )}
          {type === "14" && detailIntro[0].parkingfee! && (
            <tr key="주차료">
              <th>
                <img src="/images/icons/money.png" alt="주차료" width="35" />
                주차료
              </th>
              <td>{detailIntro[0].parkingfee}</td>
            </tr>
          )}
          {type === "14" && detailIntro[0].infocenterculture! && (
            <tr key="안내">
              <th>
                <img src="/images/icons/phone.png" alt="안내" width="35" />
              </th>
              <td>{detailIntro[0].infocenterculture}</td>
            </tr>
          )}
          {type === "14" && detailIntro[0].usetimeculture! && (
            <tr key="개장시간">
              <th>
                <img
                  src="/images/icons/open.png"
                  alt="개장시간"
                  width="40"
                ></img>
              </th>
              <td>{detailIntro[0].usetimeculture}</td>
            </tr>
          )}
          {type === "14" && detailIntro[0].restdateculture! && (
            <tr key="휴일">
              <th>
                <img src="/images/icons/closed.png" alt="휴일" width="40"></img>
              </th>
              <td>{detailIntro[0].restdateculture}</td>
            </tr>
          )}
          {type === "14" && detailIntro[0].parkingculture! && (
            <tr key="주차여부">
              <th>
                <img
                  src="/images/icons/parking.png"
                  alt="주차여부"
                  width="40"
                />
              </th>
              <td>{detailIntro[0].parkingculture}</td>
            </tr>
          )}
          {type === "14" && detailIntro[0].chkpetculture! && (
            <tr key="반려동물입장">
              <th>
                <img src="/images/icons/animal.png" alt="반려동물" width="40" />
                반려동물입장
              </th>
              <td>{detailIntro[0].chkpetculture}</td>
            </tr>
          )}
          {type === "25" && detailIntro[0].infocentertourcours! && (
            <tr key="안내">
              <th>안내</th>
              <td>{detailIntro[0].infocentertourcours}</td>
            </tr>
          )}
          {type === "25" && detailIntro[0].distance! && (
            <tr key="총 거리">
              <th>
                <img src="/images/icons/distance.png" alt="총거리" width="40" />
              </th>
              <td>{detailIntro[0].distance}</td>
            </tr>
          )}
          {type === "25" && detailIntro[0].taketime! && (
            <tr key="소요시간">
              <th>
                <img src="/images/icons/clock.png" alt="소요시간" width="35" />
              </th>
              <td>{detailIntro[0].taketime}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default BasicInfo;
