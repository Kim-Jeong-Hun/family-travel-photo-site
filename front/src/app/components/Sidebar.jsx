import React, { useState } from "react";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mobile_btn">
      <input
        type="checkbox"
        id="hamburger"
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      <label htmlFor="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </label>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul className="nav_mobile">
          <li>
            <a href="/alert">알림</a>
          </li>
          <li>
            <a href="/album">내 앨범</a>
          </li>
          <li>
            <a href="/myPage">마이페이지</a>
          </li>
          <li>
            <a href="/settings">설정</a>
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
