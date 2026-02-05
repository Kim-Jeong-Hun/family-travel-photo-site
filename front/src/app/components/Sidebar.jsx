import React from "react";
import Link from 'next/link'; // next.js의 Link 사용하여 SPA 방식으로 개선
import Image from 'next/image';
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
        <Image
          width={141}
          height={141}
          src="/images/sidebar-logo.png"
          alt="우리 가족의 이야기가 시작되는 곳"
          className="sidebar_image"
        />
        <br />
        <p>© 2025 여기담다. All rights reserved.</p>
        <p>Developer : {" "}
          <a href="https://github.com/Kim-Jeong-Hun" target="_blank" rel="noreferrer">
            <Image
              width={20}
              height={20} 
              src="/images/github.svg"
              style={{ cursor: 'pointer', display: 'inline-block' }} // 인라인 블록으로 지정하여 "Developer : "와 같은 라인으로 설정 
              alt="GitHub" 
            />
          </a>
           <span> | </span> 
            <Image
              width={20}
              height={20}
              src="/images/envelope.svg"
              style={{ cursor: 'pointer', display: 'inline-block' }} // 인라인 블록으로 지정하여 "Developer : "와 같은 라인으로 설정
              onClick={() => {
                alert("개발자 이메일 : kimjeonghun213@gmail.com");
              }}
              alt="Email"
            />
          </p>
      </div>
    </div>
  );
};

export default Sidebar;