import React from 'react';
import HamburgerButton from './HamburgerButton';
import Title from './Title';

function MainUpperPart(props) {
    return (
        <nav className="flex flex-row items-center w-full h-full">
            <div>
                <HamburgerButton />
            </div>
            <div>
                <Title />
            </div>
        </nav>
    );
}

export default MainUpperPart;