import React from "react";

function HamburgerButton({ isOpen, toggle }) {
  return (
    <div className="mobile_btn">
      <input
        type="checkbox"
        id="hamburger"
        checked={isOpen}
        onChange={toggle} // MainUpperPart(부모)로부터 받은 함수 실행
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
    </div>
  );
};

export default HamburgerButton;