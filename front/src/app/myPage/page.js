"use client";
import {useState, React} from 'react';

function My_page() {
    const [isUser, setIsUser] = useState("사용자");

    return (
        <div>
            <p><h4>{isUser}님, 환영합니다!!</h4></p>
        </div>
    );
}

export default My_page;