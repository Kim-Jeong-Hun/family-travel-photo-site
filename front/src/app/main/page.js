"use client";

import { useEffect } from "react";

export default function Main() {
  useEffect(() => {
    console.log("window.kakao:", window.kakao);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(36.34, 127.77),
          level: 13,
        };
        new window.kakao.maps.Map(container, options);
      });
    };

    if (window.kakao && window.kakao.maps) {
      console.log("카카오 맵 로드 시작");
      onLoadKakaoMap();
      console.log("카카오 맵 로드 성공");
    } else {
      console.log("kakao 객체가 없음.");

    }
  }, []);

  return (
    <>
      <div id="map" className="w-full h-full"></div>
    </>
  );
}


/*
카카오맵 : 

*/