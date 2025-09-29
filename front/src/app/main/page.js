"use client"; // Next.js에서 클라이언트 컴포넌트임을 명시

import { useEffect } from "react";

export default function Main() {
  useEffect(() => {
    // window.kakao 객체 로그 출력 (확인용)
    console.log("window.kakao:", window.kakao);

    const onLoadKakaoMap = () => { // 카카오맵을 로드하는 함수
      window.kakao.maps.load(() => { // 카카오맵 API가 로드되면 실행
        const container = document.getElementById("map"); // 지도를 표시할 DOM 요소 선택
        const options = { // 지도 옵션 설정
          center: new window.kakao.maps.LatLng(36.34, 127.77), // 지도 중심 좌표
          level: 13, // 지도 확대 레벨
        };
        new window.kakao.maps.Map(container, options); // 지도 생성
      });
    };

    if (window.kakao && window.kakao.maps) { // 카카오맵 객체가 있으면
      console.log("카카오 맵 로드 시작"); // 로드 시작 로그 (확인용)
      onLoadKakaoMap(); // 지도 로드 함수 실행
      console.log("카카오 맵 로드 성공"); // 로드 성공 로그 (확인용)
    } else { // 카카오맵 객체가 없으면
      console.log("kakao 객체가 없음."); // 에러 로그 출력 (확인용)
    }
    
  }, []); // 의존성 배열이 비어 있으므로 최초 1회만 실행

  return (
    <>
      <div id="map" className="w-full h-full"></div> {/* 지도를 표시할 div */}
    </>
  );
}