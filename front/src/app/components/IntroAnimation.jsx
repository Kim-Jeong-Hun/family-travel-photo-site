"use client";

import React, { useState, useEffect } from "react";
import "@/app/styles/IntroAnimation.css"; // CSS 파일 추가

export default function IntroAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3); // 0, 1, 2 반복
    }, 2000); // 1초 Fade-in + 1초 Fade-out

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
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