import { React, useState } from "react";
import Sidebar from "./Sidebar";
import Title from "./Title";
import LoginButton from "./LoginButton";
import HamburgerButton from "./HamburgerButton";

function MainUpperPart() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-row w-full h-full bg-[#FFFBEF] items-center relative">
      <div className="flex flex-1 justify-start items-center">
        <HamburgerButton 
          isOpen={isOpen} 
          toggle={() => setIsOpen(!isOpen)} 
        />
      </div>
      <Title />
      <div className="flex flex-1 justify-end items-center mr-[10px]">
        <LoginButton />
      </div>
      <Sidebar 
        isOpen={isOpen} 
      />
    </div>
  );
}

export default MainUpperPart;
