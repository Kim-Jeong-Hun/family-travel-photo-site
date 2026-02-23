"use client";

import { useState } from "react";
import Image from "next/image";

function PhotoSection({ imageUrls = [], content }) {
  // 기본값 [] 설정으로 undefined 방지
  const [selectedIndex, setSelectedIndex] = useState(null);
  const closeModal = () => setSelectedIndex(null);

  // imageUrls가 있을 때만 slice를 실행하도록 안전하게 처리
  const displayImages = imageUrls?.slice(0, 10) || [];

  return (
    <div className="mt-4 px-4 md:px-0">
      {/* 1. grid-cols-5: 무조건 한 행에 5개
        2. auto-rows: 내용에 맞게 높이 조절
        3. gap: 이미지 사이 간격
      */}
      <div className="grid grid-cols-5 gap-1.5 md:gap-2">
        {displayImages.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedIndex(index)}
            // aspect-square: 모바일에서 정사각형 유지
            // lg:h-[300px] lg:aspect-auto: PC에서 높이 300px 고정
            className="relative cursor-pointer active:scale-95 transition-transform overflow-hidden rounded-md aspect-square lg:h-[300px] lg:aspect-auto"
          >
            <Image
              src={img.image_url}
              alt={`post-image-${index}`}
              fill
              sizes="(max-width: 1024px) 20vw, 20vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* --- 라이트박스 모달 --- */}
      {selectedIndex !== null && displayImages[selectedIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <button
            className="absolute top-6 right-6 text-white text-4xl z-[70]"
            onClick={closeModal}
          >
            &times;
          </button>

          <div
            className="relative bg-white w-full max-w-[550px] flex flex-col rounded-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square w-full">
              <Image
                src={displayImages[selectedIndex].image_url}
                alt="Full"
                fill
                className="object-cover"
                priority
              />

              <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none">
                {selectedIndex > 0 && (
                  <button
                    className="w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors pointer-events-auto"
                    onClick={() => setSelectedIndex(selectedIndex - 1)}
                  >
                    ‹
                  </button>
                )}
                {selectedIndex < displayImages.length - 1 && (
                  <button
                    className="w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors pointer-events-auto"
                    onClick={() => setSelectedIndex(selectedIndex + 1)}
                  >
                    ›
                  </button>
                )}
              </div>
            </div>
            <div className="p-6 h-[120px] lg:h-[160px] flex flex-col justify-start">
              <p className="text-black font-bold text-[17px] line-clamp-3">
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
