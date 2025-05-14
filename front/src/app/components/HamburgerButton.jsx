import React, { useState } from 'react';
import "@/app/styles/HamburgerButton.css"

export default function HamburgerButton() {
    const [isActive, setIsActive] = useState(false);

    return (
        <div
            className={`hamburger ${isActive ? "is-active" : ""}`}
            onClick={() => setIsActive(!isActive)}>
            <div className="hamburger_container">
                <div className="hamburger_inner"></div>
                <div className="hamburger_hidden"></div>
            </div>
        </div>
    );
}