'use client';
import MainUpperPart from "../components/MainUpperPart";

export default function Map() {
  return (
    <main className="w-full h-screen">
      <div className="rounded-b-3xl flex justify-center items-center w-full h-[12.5%] bg-[#ECFAF6]">
        <MainUpperPart />
      </div>
      <div className="flex flex-col justify-center items-center w-full h-[87.5%] bg-[#D9D9D9]">
        <h3><b><u>여기담다</u></b></h3>
        <p>우리 가족의 이야기가 시작되는 곳</p>
      </div>
    </main>
  );
}


