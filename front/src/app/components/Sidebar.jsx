import React from "react";
import Link from 'next/link'; // next.js의 Link 사용하여 SPA 방식으로 개선
import "../styles/Sidebar.css";

function Sidebar({ isOpen }) {
  return (
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
          <a href="https://github.com/Kim-Jeong-Hun" target="_blank" rel="noopener noreferrer">
            <img src="/images/github.svg" alt="GitHub" />
          </a>{" "}
          |{" "}
          <img
            src="/images/envelope.svg"
            alt="Email"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              alert("kimjeonghun213@gmail.com");
            }}
          />
        </p>
      </div>
    </div>
  );
};

export default Sidebar;