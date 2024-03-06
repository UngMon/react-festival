import { useEffect, useRef } from "react";
import { ContentCommon } from "../../../type/FestivalType";

interface MapProps {
  detailCommon: ContentCommon[];
}

const Map = ({ detailCommon }: MapProps) => {
  const { kakao } = window;
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { mapx, mapy } = detailCommon[0];
    let container = mapRef.current!; //지도를 담을 영역의 DOM 레퍼런스
    console.log(detailCommon)
    let options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(Number(mapy), Number(mapx)), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };

    let map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

    // 마커가 표시될 위치입니다
    var markerPosition = new kakao.maps.LatLng(Number(mapy), Number(mapx));

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
  }, [detailCommon, kakao]);

  return (
    <div style={{ marginBottom: "20px" }}>
      <div className="map">
        <strong className="label">주소</strong>
        <span>{detailCommon[0].addr1}</span>
      </div>
      {/* <div
        id="map"
        style={{ width: "100%", height: "400px" }}
        ref={mapRef}
      ></div> */}
    </div>
  );
};

export default Map;
