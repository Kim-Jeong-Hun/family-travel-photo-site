import React from "react";
import Sidebar from "./Sidebar";
import Title from "./Title";

function MainUpperPart() {
  return (
    <div className="flex flex-row w-full h-full bg-[#FFFBEF] justify-center items-center">
      <Sidebar />
      <Title />
    </div>
  );
}

export default MainUpperPart;