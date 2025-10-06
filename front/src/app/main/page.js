"use client"; // Next.js에서 클라이언트 컴포넌트임을 명시

import { useEffect, useRef } from "react";

export default function Main() {
  useEffect(() => {
    // 카카오맵 스크립트가 로드되지 않았다면 함수를 종료
    if (!window.kakao.maps) {
      return;
    }

    const onLoadKakaoMap = () => { // 카카오맵을 로드하는 함수
      window.kakao.maps.load(() => { // 카카오맵 API가 로드되면 실행
        const container = document.getElementById("map"); // 지도를 표시할 DOM 요소 선택
        const options = { // 지도 옵션 설정
          center: new window.kakao.maps.LatLng(36.34, 127.77), // 지도 중심 좌표
          level: 13, // 지도 확대 레벨
        };
        const map = new window.kakao.maps.Map(container, options); // 지도 생성
        
        let marker = null; // 마커 변수

        let mapTypeControl = new kakao.maps.MapTypeControl(); // 맵 종류 컨트롤 변수
        let zoomControl = new kakao.maps.ZoomControl(); // 줌 컨트롤 변수

        // 지도 클릭 시 마커 생성 또는 위치 이동
        window.kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
          const latlng = mouseEvent.latLng;
          if (!marker) {
            marker = new window.kakao.maps.Marker({
              position: latlng,
              map: map,
            });
          } else {
            marker.setPosition(latlng);
          }
        });

        // 지도 우상단에 맵 종류 컨트롤 추가, 우단에 줌 컨트롤 추가
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

      });
    };

    onLoadKakaoMap();
    console.log("kakao 지도 출력");



  }, []); // 의존성 배열이 비어 있으므로 최초 1회만 실행

  return (
    <>
      <div id="map" className="w-full h-full"></div> {/* 지도를 표시할 div */}
    </>
  );
}

/*
- 지도에 마커 생성 기능 추가
- 카카오객체 유효성 체크 코드 제거
- 추후 useRef 훅 배워서 사용하기 위해 useRef 미리 import
*/

/*
카카오지도 API를 이용해서 지도에 마커를 찍고 싶어.
근데 useEffect 안에 써도 괜찮을까?

네, 카카오지도 API를 `useEffect` 안에서 사용하는 것은 **완벽하게 올바른 방법**입니다. 
오히려 그렇게 사용하는 것이 React의 작동 방식에 맞는 **가장 정석적인 방법**입니다. 👍

React 컴포넌트의 주된 역할은 UI를 렌더링하는 것입니다. 
카카오지도 API처럼 외부 라이브러리를 사용해 DOM을 직접 조작하는 행위는 React의 입장에서는 'Side Effect(부수 효과)'에 해당합니다. 
`useEffect`는 바로 이런 Side Effect를 처리하기 위해 만들어진 Hook입니다.

### ## 왜 `useEffect`를 사용해야 할까요?

1. **DOM 접근 시점**: 
React는 렌더링이 끝난 후에야 실제 DOM이 생성됩니다. 
`useEffect`는 렌더링이 완료된 후 실행되므로, 카카오 지도를 삽입할 `<div>`와 같은 DOM 요소에 안전하게 접근할 수 있습니다. 
만약 `useEffect` 없이 컴포넌트 본문에 지도 생성 코드를 바로 넣으면, 
해당 코드가 실행되는 시점에는 아직 DOM이 준비되지 않아 오류가 발생합니다.

2. **불필요한 재실행 방지**: 
`useEffect`의 의존성 배열(`[]`)을 비워두면, 컴포넌트가 처음 마운트될 때 **단 한 번만** 지도 생성 코드를 실행할 수 있습니다. 
만약 이 코드가 컴포넌트 본문에 있다면, 
컴포넌트가 리렌더링될 때마다 새로운 지도를 계속해서 생성하려고 시도하여 성능 문제를 일으키고 지도도 겹쳐서 보이게 됩니다.
*/