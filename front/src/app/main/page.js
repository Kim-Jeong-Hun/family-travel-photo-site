"use client"; // Next.js에서 클라이언트 컴포넌트임을 명시

import { useEffect, useState } from "react";
import PostModal from "../components/PostModal";

export default function Main() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState({ name: '', address: '' });

  useEffect(() => {

    // 카카오맵 스크립트가 로드되지 않았다면 함수를 종료
    if (!window.kakao.maps) {
      return;
    }

    // 1. 카카오맵 API 가져와서 지도 생성
    const onLoadKakaoMap = () => { // 카카오맵을 로드하는 함수
      window.kakao.maps.load(() => { // 카카오맵 API가 로드되면 실행
        const mapContainer = document.getElementById("map"); // 지도를 표시할 DOM 요소 선택
        const mapOption = { // 지도 옵션 설정
          center: new window.kakao.maps.LatLng(36.34, 127.77), // 지도 중심 좌표
          level: 13, // 지도 확대 레벨
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도 생성

        // 2. 지도에 맵 종류, 줌 컨트롤 기능 추가
        let mapTypeControl = new kakao.maps.MapTypeControl(); // 맵 종류 컨트롤 변수
        let zoomControl = new kakao.maps.ZoomControl(); // 줌 컨트롤 변수

        // 지도 우상단에 맵 종류 컨트롤 추가
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
        
        // 지도 오른쪽에 줌 컨트롤 추가
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);


        // 3. 지도에 커스텀 오버레이 마커 생성용 변수 추가
        let marker = null; // 마커 변수
        let overlay = null; // 오버레이 변수

        // 4. 좌표를 주소로 변환할 때 사용하는 Geocoder 객체, 
        // 건물명, 카테고리, 연락처가 필요할 때 사용하는 Places 객체 추가
        let geocoder = new window.kakao.maps.services.Geocoder(); // Geocoder 객체
        let places = new window.kakao.maps.services.Places(); // Places 객체

        // 동적 콘텐츠 생성 함수 - TailwindCSS는 정적으로만 동작하므로 바닐라 CSS로 구현
        const createContent = (placeName, placePhone, placeCategory, placeAddress) => `
  <div style="width: 300px; text-align: left; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 1.5;">
    <div style="position: relative; background-color: rgb(255, 255, 255); border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid rgb(209, 213, 219); overflow: hidden;">      
      <!-- 내용 영역 -->
      <div style="padding: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div style="flex: 1; margin-right: 8px;">
            <div style="font-weight: bold; font-size: 15px; margin-bottom: 4px; word-break: break-word;">${placeName}</div>
            <div style="font-size: 12px; color: rgb(107, 114, 128); margin-bottom: 2px; word-break: break-word;">${placePhone}</div>
            <div style="font-size: 12px; color: rgb(107, 114, 128); margin-bottom: 8px; word-break: break-word;">${placeCategory}</div>
            <div style="font-size: 12px; color: rgb(107, 114, 128); margin-bottom: 8px; word-break: break-word;">${placeAddress}</div>
          </div>
          <!-- x 버튼 -->
          <button onclick="closeOverlay()" style="width: 20px; height: 20px; background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;" title="닫기">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 18px; height: 18px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- 저장 버튼 스타일링 -->
        <!-- 모양 :  -->
        <!-- 민트색 버튼 + 마우스 이벤트 따라 명도 변경 -->
        <button 
          onclick="saveLocation('${placeName.replace(/'/g, "\\'")}', '${placeAddress.replace(/'/g, "\\'")}')" 
          style="width: 100%; padding: 8px 12px; background-color: rgb(59, 181, 170); color: white; border-radius: 4px; border: none; cursor: pointer; font-weight: 500; font-size: 13px;"
          onmouseover="this.style.backgroundColor='rgb(26, 143, 133)'"
          onmouseout="this.style.backgroundColor='rgb(59, 181, 170)'"
        >
          이 장소 저장하기
        </button>
      </div>
    </div>
  </div>
`;

        // 3.1. 지도 클릭 시 클릭된 좌표에 마커 생성
        // 3.2. 마커 생성 후 마커에 커스텀 오버레이 표시
        // 4.1. Geocoder, Places 객체로 주소, 건물명, 전화번호, 카테고리 받아오기
        // 4.2. 오버레이 컨텐츠 실제 생성
        window.kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
          const latlng = mouseEvent.latLng; // 마우스 클릭한 곳의 좌표 저장 변수

          // 장소 검색(Places객체)에 사용할 옵션 설정
          let placeOptions = {
            location: latlng,
            radius: 20, // 20미터 이내
            sort: kakao.maps.services.SortBy.DISTANCE
          }

          // 오버레이 업데이트 함수 (먼저 정의)
          function updateOverlay(latlng, content) {
            if (!marker) {
              marker = new window.kakao.maps.Marker({
                position: latlng,
                map: map,
              });

              overlay = new window.kakao.maps.CustomOverlay({
                content: content,
                map: map,
                position: marker.getPosition(),
                xAnchor: 0.5, // 마커로부터 x거리
                yAnchor: 1.3 // 마커로부터 y거리
              });
            } else {
              marker.setPosition(latlng);
              if (overlay) {
                overlay.setContent(content);
                overlay.setPosition(latlng);
              }
            }
          }

          // Places API를 사용해 좌표 근처의 POI 검색
          places.keywordSearch('', function(result, status) {
            let placeName = '위치 정보';
            let placePhone = '전화번호';
            let placeCategory = '카테고리';
            let placeAddress = '';

            if (status === kakao.maps.services.Status.OK && result.length > 0) {
              // Places 검색 성공
              let place = result[0];
              placeName = place.place_name;
              placePhone = place.phone || '전화번호';
              placeCategory = place.category_name || '카테고리';
              placeAddress = place.address_name;

              const content = createContent(placeName, placePhone, placeCategory, placeAddress, '');
              updateOverlay(latlng, content);
            } else {
              // Places 검색 실패 시 Geocoder 사용
              geocoder.coord2Address(latlng.getLng(), latlng.getLat(), function(result, status) { 
                if(status === window.kakao.maps.services.Status.OK) {
                  if (result[0].road_address) {
                    placeName = result[0].road_address.region_3depth_name || '위치 정보';
                    placeAddress = result[0].road_address.address_name;
                  } else if (result[0].address) {
                    placeName = result[0].address.region_3depth_name || '위치 정보';
                    placeAddress = result[0].address.address_name;
                  }

                  const content = createContent(placeName, placePhone, placeCategory, placeAddress);
                  updateOverlay(latlng, content);
                }
              });
            }
          }, placeOptions);
        });        

        // 오버레이 저장 버튼 클릭 시, 실행되는 함수
        window.saveLocation = function(placeName, placeAddress) {
          console.log(`위치 저장 : ${placeName}, ${placeAddress}`);
          setSelectedPlace({ name: placeName, address: placeAddress });
          setIsModalOpen(true);
        };

        // 오버레이 닫기 함수를 전역으로 설정
        window.closeOverlay = function() {
          if (overlay) {
            overlay.setMap(null);
            overlay = null;
          }
        }
      });
    };

    onLoadKakaoMap();
    console.log("kakao 지도 출력");
  }, []); // 의존성 배열이 비어 있으므로 최초 1회만 실행

  return (
    <>
      <PostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        placeName={selectedPlace.name}
        placeAddress={selectedPlace.address}
      />
      <div id="map" className="w-full h-full"> {/* 지도를 표시할 div */}
        <div id="keyword">
        </div>
      </div> 
    </>
  );
}

/*
- 마커 오버레이 x 버튼 눌러서 닫을 시, 다음 좌표 클릭에 오버레이 생성 안되는 문제 수정 필요
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