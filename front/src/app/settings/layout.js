"use client";

import "@/app/styles/globals.css";
import MainUpperPart from "../components/MainUpperPart";

export default function SettingsLayout({ children }) {
  return (
    <main className="w-full h-screen">
      <div className="w-full h-[12.4%] border-b border-[#D9D9D9] rounded-b-2xl">
        <MainUpperPart />
      </div>
      <div className="flex flex-col justify-center items-center w-full h-[87.5%] bg-[#FFFFFF]">
        {children}
      </div>
    </main>
  );
}