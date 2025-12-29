import React from "react";
import Sidebar from "./Sidebar";
import Title from "./Title";
import LoginButton from "./LoginButton";

function MainUpperPart() {
  return (
    <div className="flex flex-row w-full h-full bg-[#FFFBEF] justify-center items-center">
      <Sidebar />
      <Title />
      <LoginButton />
    </div>
  );
}

export default MainUpperPart;