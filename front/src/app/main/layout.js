"use client";

import Script from "next/script";
import "@/app/styles/globals.css";
import MainUpperPart from "../components/MainUpperPart";

export default function MainPageLayout({ children }) {
  return (
    <>
      {/* 카카오맵 SDK 스크립트 */}
      {/* React가 인터랙티브하게 동작하기 전에 스크립트를 먼저 불러오라는 뜻.
          지도 같은 외부 SDK는 초기에 반드시 로딩되어야 하므로, 이 옵션이 필요함. */}
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`}
        strategy="beforeInteractive"
      />
      <main className="w-full h-screen">
        <div className="w-full h-[12.4%] border-b border-[#D9D9D9] rounded-b-2xl">
          <MainUpperPart />
        </div>
        <div className="flex flex-col justify-center items-center w-full h-[87.5%] bg-[#FFFFFF]">
          {children}
        </div>
      </main>
    </>
  );
}
