"use client";
import { useState, React } from "react";

function Settings_page() {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  /* html 태그 만든 후 -> css 적용 -> react로 변환 -> javascript 및 이벤트 핸들러, 라이브러리 적용 */
  return (
    <div>
      <div>
        <form className="w-[290px] lg:w-[1000px]" onSubmit={handleSubmit}>
          <div className="mb-[20px] lg:mb-[40px]">
            <h3 className="mb-[20px] lg:mb-[40px]">테마</h3>
            <div className="flex justify-around gap-[40px] lg:gap-[300px]">
              <div className="flex flex-col items-center">
                <img
                  src="/images/light_theme.png"
                  alt="라이트 테마"
                  className="mb-[20px]"
                />
                <label htmlFor="basic" className="mb-[5px]">
                  라이트
                </label>
                <input
                  type="radio"
                  name="theme"
                  id="basic"
                  className="mb-[30px] w-[20px] h-[20px]"
                />
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="/images/dark_theme.png"
                  alt="다크 테마"
                  className="mb-[20px]"
                />
                <label htmlFor="dark" className="mb-[5px]">
                  다크
                </label>
                <input
                  type="radio"
                  name="theme"
                  id="dark"
                  className="mb-[30px] w-[20px] h-[20px]"
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-[20px] lg:mb-[40px]">기본 언어 설정</h3>
            <select
              name="languages"
              id="lang"
              className="w-[200px] h-[40px] text-[15px] mb-[100px]"
            >
              <option value="korean">한국어</option>
              <option value="english">English</option>
              <option value="japanese">日本語</option>
              <option value="spanish">español</option>
            </select>
            <br />
            <div className="flex justify-end">
              <input
                type="submit"
                value="저장하기"
                className="w-[100px] h-[40px] text-[15px] font-[700] rounded-[6px] bg-[#56E6D9]"
              />
            </div>
          </div>
        </form>
        <div>
          <h4 className="mb-[10px]">About</h4>
          <div className="flex flex-row justify-between">
            <h5>App Version</h5>
            <h5>1.0.0</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings_page;


// 반응형 웹디자인 적용 안되는 이유 찾기
// 다크 테마 추가하기 (tailwindcss 기능)