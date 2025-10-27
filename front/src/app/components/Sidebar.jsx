import React, { useState, useEffect } from "react";
import Link from 'next/link'; //next.js의 Link 사용하여 SPA 방식으로 개선
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if(e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
  };

  window.addEventListener('keydown', handleGlobalKeyDown);

  // 컴포넌트 언마운트 시 이벤트 리스너 제거
  return () => {
    window.removeEventListener('keydown', handleGlobalKeyDown);
  }

  }, [isOpen]);

  return (
    <div className="mobile_btn">
      <input
        type="checkbox"
        id="hamburger"
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      <label 
        htmlFor="hamburger"
        role="button"
        aria-label={`메뉴 ${isOpen ? '닫기' : '열기'}`}
      >
        <span></span>
        <span></span>
        <span></span>
      </label>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul className="nav_mobile">
          <li>
            <Link href="/alert">알림</Link>
          </li>
          <li>
            <Link href="/album">내 앨범</Link>
          </li>
          <li>
            <Link href="/myPage">마이페이지</Link>
          </li>
          <li>
            <Link href="/settings">설정</Link>
          </li>
        </ul>
        <div className="sidebar_footer">
          <img
            src="/images/sidebar-logo.png"
            alt="우리 가족의 이야기가 시작되는 곳"
            className="sidebar_image"
          />
          <br />
          <p>© 2025 여기담다. All rights reserved.</p>
          <p>
            Developer :{" "}
            <a href="https://github.com/Kim-Jeong-Hun">
              <img src="/images/github.svg" alt="GitHub" />
            </a>{" "}
            |{" "}
            <img
              src="/images/envelope.svg"
              alt="Email"
              onClick={() => {
                alert("kimjeonghun213@gmail.com");
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


/* 
사이드바 만드는 법 :

- useState의 상태 isOpen, setIsOpen 활용하여 className 동적으로 변경하여 css 변경 
    (Sidebar.css에 스타일 정의됨)
*/