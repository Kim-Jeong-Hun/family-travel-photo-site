import React from "react";
import MobileMenu from "./MobileMenu";
import Title from "./Title";

function MainUpperPart() {
  return (
    <div className="flex flex-row w-full h-full bg-[#FFFBEF] justify-center items-center">
      <MobileMenu />
      <Title />
    </div>
  );
}

export default MainUpperPart;

/*
상단 부분 아래쪽 round하게 수정 필요
*/