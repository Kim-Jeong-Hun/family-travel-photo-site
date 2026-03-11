"use client"; // Next.js에서 클라이언트 컴포넌트임을 명시

import { useEffect, useState, useCallback } from "react";
import PostModal from "../components/PostModal";
import Script from "next/script";
import { useRouter } from "next/navigation";

export default function Main() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState({
    name: "",
    address: "",
    lat: null,
    lng: null,
  });

  const router = useRouter();

  /**
   * 카카오맵 초기화 로직 (useCallback으로 메모이제이션)
   * Script 컴포넌트의 onLoad 시점에 실행됩니다.
   */
  const initMapLogic = useCallback(() => {
    // 카카오맵 스크립트가 로드되지 않았다면 함수를 종료
    if (!window.kakao || !window.kakao.maps) return;

    // 1. 카카오맵 API 가져와서 지도 생성
    window.kakao.maps.load(() => {
      // 카카오맵 API가 로드되면 실행
      const mapContainer = document.getElementById("map"); // 지도를 표시할 DOM 요소 선택
      const mapOption = {
        // 지도 옵션 설정
        center: new window.kakao.maps.LatLng(36.34, 127.77), // 지도 중심 좌표
        level: 13, // 지도 확대 레벨
      };
      const map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도 생성

      // 2. 지도에 맵 종류, 줌 컨트롤 기능 추가
      let mapTypeControl = new window.kakao.maps.MapTypeControl(); // 맵 종류 컨트롤 변수
      let zoomControl = new window.kakao.maps.ZoomControl(); // 줌 컨트롤 변수

      // 지도 우상단에 맵 종류 컨트롤 추가
      map.addControl(
        mapTypeControl,
        window.kakao.maps.ControlPosition.TOPRIGHT,
      );
      // 지도 오른쪽에 줌 컨트롤 추가
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // 3. 지도에 커스텀 오버레이 마커 생성용 변수 추가
      let marker = null; // 마커 변수
      let overlay = null; // 오버레이 변수

      // 오버레이 닫기 함수를 전역으로 설정 (HTML 스트링 내부 onclick에서 호출하기 위함)
      window.closeOverlay = function () {
        if (overlay) {
          overlay.setMap(null);
          overlay = null;
        }
        if (marker) {
          marker.setMap(null);
          marker = null;
        }
      };

      // 4. 좌표를 주소로 변환할 때 사용하는 Geocoder 객체,
      // 건물명, 카테고리, 연락처가 필요할 때 사용하는 Places 객체 추가
      let geocoder = new window.kakao.maps.services.Geocoder(); // Geocoder 객체
      let places = new window.kakao.maps.services.Places(); // Places 객체

      // 동적 콘텐츠 생성 함수 (오버레이 내부 HTML)
      const createContent = (
        placeName,
        placePhone,
        placeCategory,
        placeAddress,
      ) => `
        <div style="width: 300px; text-align: left; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 1.5;">
          <div style="position: relative; background-color: rgb(255, 255, 255); border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid rgb(209, 213, 219); overflow: hidden;">       
            <div style="padding: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div style="flex: 1; margin-right: 8px;">
                  <div style="font-weight: bold; font-size: 15px; margin-bottom: 4px; word-break: break-word;">${placeName}</div>
                  <div style="font-size: 12px; color: rgb(107, 114, 128); margin-bottom: 2px; word-break: break-word;">${placePhone}</div>
                  <div style="font-size: 12px; color: rgb(107, 114, 128); margin-bottom: 8px; word-break: break-word;">${placeCategory}</div>
                  <div style="font-size: 12px; color: rgb(107, 114, 128); margin-bottom: 8px; word-break: break-word;">${placeAddress}</div>
                </div>
                <button onclick="closeOverlay()" style="width: 20px; height: 20px; background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;" title="닫기">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 18px; height: 18px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
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

      // 3.1. 지도 클릭 시 클릭된 좌표에 마커 생성 & 3.2. 마커 생성 후 마커에 커스텀 오버레이 표시
      window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
        const latlng = mouseEvent.latLng; // 마우스 클릭한 곳의 좌표 저장 변수
        console.log(latlng);

        const lat = latlng.getLat();
        const lng = latlng.getLng();

        // 얻은 좌표만 미리 넣어두기 (PostModal 전달용)
        setSelectedPlace((prev) => ({ ...prev, lat, lng }));

        // 장소 검색(Places객체)에 사용할 옵션 설정
        let placeOptions = {
          location: latlng,
          radius: 20, // 20미터 이내
          sort: window.kakao.maps.services.SortBy.DISTANCE,
        };

        // 오버레이 업데이트 함수
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
              xAnchor: 0.5,
              yAnchor: 1.3,
            });
          } else {
            marker.setPosition(latlng);
            if (overlay) {
              overlay.setContent(content);
              overlay.setPosition(latlng);
            }
          }
        }

        // 4.1. Geocoder, Places 객체로 주소, 건물명, 전화번호, 카테고리 받아오기 & 4.2. 오버레이 컨텐츠 실제 생성
        places.keywordSearch(
          "",
          function (result, status) {
            let placeName = "위치 정보";
            let placePhone = "전화번호";
            let placeCategory = "카테고리";
            let placeAddress = "";

            if (
              status === window.kakao.maps.services.Status.OK &&
              result.length > 0
            ) {
              let place = result[0];
              placeName = place.place_name;
              placePhone = place.phone || "전화번호";
              placeCategory = place.category_name || "카테고리";
              placeAddress = place.address_name;

              const content = createContent(
                placeName,
                placePhone,
                placeCategory,
                placeAddress,
              );
              updateOverlay(latlng, content);
            } else {
              geocoder.coord2Address(
                latlng.getLng(),
                latlng.getLat(),
                function (result, status) {
                  if (status === window.kakao.maps.services.Status.OK) {
                    if (result[0].road_address) {
                      placeName =
                        result[0].road_address.region_3depth_name ||
                        "위치 정보";
                      placeAddress = result[0].road_address.address_name;
                    } else if (result[0].address) {
                      placeName =
                        result[0].address.region_3depth_name || "위치 정보";
                      placeAddress = result[0].address.address_name;
                    }
                    const content = createContent(
                      placeName,
                      placePhone,
                      placeCategory,
                      placeAddress,
                    );
                    updateOverlay(latlng, content);
                  }
                },
              );
            }
          },
          placeOptions,
        );
      });
    });
  }, []);

  useEffect(() => {
    // 오버레이 저장 버튼 클릭 시 실행되는 함수를 전역에 등록
    window.saveLocation = (placeName, placeAddress) => {
      // 토큰 있으면 modal이 열리고, 없으면 로그인 페이지로 추방하는 로직 추가
      const currentToken = localStorage.getItem("accessToken");

      if (!currentToken) {
        alert("로그인이 필요한 서비스입니다.");
        // 렌더링 도중이 아닌, 이벤트 발생 시점에 이동하므로 안전하지만
        // 만약 렌더링 도중 체크 로직이 있다면 useEffect 안으로 옮겨야 합니다.
        window.location.href = "/login";
        return;
      }

      // 클릭 이벤트가 발생했을 때만 실행되므로 이 부분은 안전합니다.
      setSelectedPlace((prev) => ({
        ...prev,
        name: placeName,
        address: placeAddress,
      }));
      setIsModalOpen(true);
    };

    return () => {
      // 컴포넌트 언마운트 시 전역 함수 정리
      delete window.saveLocation;
      delete window.closeOverlay;
    };
  }, []); // 최초 1회만 실행

  return (
    <>
      {/* 카카오맵 SDK 스크립트 
        - strategy="afterInteractive": 페이지 초기 로드 속도를 위해 하이드레이션 중 로드
        - autoload=false: SDK 로드 후 명시적으로 kakao.maps.load()를 호출해야 함
      */}
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={initMapLogic} // 스크립트가 브라우저에 로드 완료되면 initMapLogic 실행
      />

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        placeName={selectedPlace.name}
        placeAddress={selectedPlace.address}
        lat={selectedPlace.lat}
        lng={selectedPlace.lng}
      />
      <div id="map" className="w-full h-full">
        {" "}
        {/* 지도를 표시할 div */}
        <div id="keyword"></div>
      </div>
    </>
  );
}
