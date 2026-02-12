import { useEffect, useRef, useState } from "react";
import { ContentCommon } from "types/ContentType";
import "./Map.css";

interface MapProps {
  detailCommon: ContentCommon[];
}

const Map = ({ detailCommon }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isExistKakaoMap, setIsExistKakaoMap] = useState<boolean>(true)

  useEffect(() => {
    const { kakao } = window;

    // kakao 객체가 아예 없는 경우(스크립트 로딩 중) 예외 처리
    if (!kakao || !kakao.maps) {
      setIsExistKakaoMap(false)
      console.log("카카오 맵 객체가 아직 준비되지 않았습니다.");
      return;
    }

    // kakao 객체가 있고, maps 객체가 준비되었을 때 실행
    kakao.maps.load(() => {
      if (!mapRef.current || !detailCommon[0]) return;

      const { mapx, mapy } = detailCommon[0];
      const container = mapRef.current;

      const options = {
        center: new kakao.maps.LatLng(Number(mapy), Number(mapx)),
        level: 3,
      };

      const map = new kakao.maps.Map(container, options);
      const markerPosition = new kakao.maps.LatLng(Number(mapy), Number(mapx));
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });

      marker.setMap(map);
    });
  }, [detailCommon]);

  return (
    <div>
      <div className="map">
        <strong className="label">주소</strong>
        <span>{detailCommon[0].addr1}</span>
      </div>
      {isExistKakaoMap && <div
        id="map"
        style={{ width: "100%", height: "400px" }}
        ref={mapRef}
      ></div>}
    </div>
  );
};

export default Map;
