"use client";

import React, { useState, useEffect } from "react";
import "@/app/styles/IntroAnimation.css"; // CSS 파일 추가

function IntroAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3); // 0, 1, 2 반복
    }, 2000); // 1초 Fade-in + 1초 Fade-out
    //useEffect : 첫 번째 이미지가 렌더링 된 이후 다음 이미지로 index 변경

    return () => clearInterval(interval);
  }, []);

  const images = [
    "/Transportation Glyph Icons Collection/air-airplane-dotted-svgrepo-com.svg",
    "/Transportation Glyph Icons Collection/big-boat-boats-svgrepo-com.svg",
    "/Transportation Glyph Icons Collection/light-lights-rail-svgrepo-com.svg",
  ];

  return (
    <div className="intro-background">
      <div className="animation-container">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`icon-${index}`}
            className={`svg-image ${currentIndex === index ? "visible" : ""}`}
          />
      ))}
      </div>
    </div>
  );
}

export default IntroAnimation;