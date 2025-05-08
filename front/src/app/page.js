"use client";

import React, { useState, useEffect } from 'react';
import IntroAnimation from './components/IntroAnimation';
import "./styles/PageStyles.css";

export default function Home() {

  const [showIntroAnimation, setShowIntroAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntroAnimation(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  if (showIntroAnimation) return <IntroAnimation />;

  return (
    <main className="page-container">
      <h3>
        <p><u><b>여기담다</b></u></p>
        <p>우리 가족의 이야기가 시작되는 곳</p>
      </h3>
    </main>
  );
}