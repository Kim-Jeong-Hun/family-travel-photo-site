"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IntroAnimation from './components/IntroAnimation';

export default function Home() {
  const router = useRouter();
  const [showIntroAnimation, setShowIntroAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntroAnimation(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  if (showIntroAnimation) return <IntroAnimation />;

  router.push('/login');
}