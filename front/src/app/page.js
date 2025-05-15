"use client";

import React, { useState, useEffect } from 'react';
import IntroAnimation from './components/IntroAnimation';
import LoginForm from './components/login_and_register_form/LoginForm';

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
    <LoginForm />
  );
}