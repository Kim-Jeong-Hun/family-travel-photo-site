"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

function PhotoSection({ imageUrls, content }) {
  // 계산된 이미지 비율과 URL을 저장할 배열 상태
  const [imagesWithRatio, setImagesWithRatio] = useState([]);
  // 라이트 박스에 띄울 이미지의 인덱스
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    // 이미지 width, height를 직접 가져와 비율 정하기
    const calculateRatios = async () => {
      const promises = imageUrls.map((img) => {
        return new Promise((resolve) => {
          // 브라우저 메모리에 이미지 객체 생성
          const htmlImg = new window.Image();

          // 이미지 객체 로드 완료 시 비율 계산하여 저장
          htmlImg.src = img.image_url;
          htmlImg.onload = () => {
            resolve({
              url: img.image_url,
              ratio: htmlImg.naturalWidth / htmlImg.naturalHeight,
            });
          };

          // 에러 발생 시 비율 1(정사각형)으로 대체하여 레이아웃 깨짐 방지
          htmlImg.onerror = () => resolve({ url: img.image_url, ratio: 1 });
        });
      });

      //모든 이미지 계산이 끝난 후에 상태 업데이트
      const results = await Promise.all(promises);
      setImagesWithRatio(results);
    };

    calculateRatios();
  }, [imageUrls]);

  // 모달 닫기 함수
  const closeModal = () => setSelectedIndex(null);

  return (
    <div className="mt-4 px-4 md:px-0">
      {/* Justified Grid */}
      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {imagesWithRatio.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedIndex(index)} // 클릭 시 인덱스 저장
            className="cursor-pointer active:scale-95 transition-transform"
            style={{
              flex: `${img.ratio} 1 calc(45% - 6px)`,
              position: "relative",
              height: "clamp(150px, 20vh, 250px)",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <Image
              src={img.url}
              alt={`post-image-${index}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>
        ))}
        <div style={{ flexGrow: 999 }} />
      </div>

      {/* --- 라이트박스 모달 --- */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-[2px] p-4"
          onClick={closeModal}
        >
          {/* 닫기 버튼 */}
          <button
            className="absolute top-6 right-6 text-white text-3xl z-[70] p-2"
            onClick={closeModal}
          >
            ✕
          </button>

          {/* 폴라로이드 카드 */}
          {/* 모바일(가로: 디바이스 크기)(세로: 가로 크기 + 120px) */}
          {/* 데스크탑(가로: 550px)(세로: 가로 크기 + 160px)*/}
          <div
            className="relative bg-white shadow-2xl w-full max-w-dvw lg:max-w-[550px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 이미지 및 이동 버튼 영역 */}
            <div
              className="relative w-full"
              style={{ aspectRatio: 1 }}
            >
              <Image
                src={imagesWithRatio[selectedIndex].url}
                alt="Full size"
                fill
                className="object-cover"
                priority
              />

              {/* 이미지 좌우 버튼 (이미지 위에 띄움) */}
              <div className="absolute inset-0 flex justify-between items-center px-2">
                {/* 이전 버튼 */}
                <div className="w-10 h-10 flex items-center justify-center">
                  {selectedIndex > 0 && (
                    <button
                      className="w-full h-full bg-black/30 hover:bg-black/50 text-white text-2xl rounded-full flex items-center justify-center transition-colors pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIndex(selectedIndex - 1);
                      }}
                    >
                      ‹
                    </button>
                  )}
                </div>

                {/* 다음 버튼 */}
                <div className="w-10 h-10 flex items-center justify-center">
                  {selectedIndex < imagesWithRatio.length - 1 && (
                    <button
                      className="w-full h-full bg-black/30 hover:bg-black/50 text-white text-2xl rounded-full flex items-center justify-center transition-colors pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIndex(selectedIndex + 1);
                      }}
                    >
                      ›
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 사진 하단 텍스트 영역 */}
            <div className="bg-white h-[120px] lg:h-[160px] flex">
              <p className="mt-[10px] text-[17px] font-bold text-black">
                {content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoSection;
