import React from 'react';

const HamburgerButton = ({ onTouch }) => {
    return(
        <button 
            onTouch={onTouch}
            onClick={onTouch}
            className="flex flex-col justify-between w-8 h-6 p-1"
            aria-label="프로필 메뉴">
            <span className="block w-full h-1 bg-black rounded"></span>
            <span className="block w-full h-1 bg-black rounded"></span>
            <span className="block w-full h-1 bg-black rounded"></span>
        </button>
    );
}

export default HamburgerButton;