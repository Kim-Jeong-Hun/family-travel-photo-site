"use client";

import "@/app/styles/globals.css";
import MainUpperPart from "../components/MainUpperPart";

export default function AlbumLayout({ children }) {
  return (
    <main className="w-full h-screen flex flex-col">
      <div className="w-full h-[12.4%] border-b border-[#D9D9D9] rounded-b-2xl">
        <MainUpperPart />
      </div>
      <div className="w-full flex justify-center flex-grow bg-[#FFFFFF]">
        <div className="w-[80%]">
          {children}
        </div>
      </div>
    </main>
  );
}