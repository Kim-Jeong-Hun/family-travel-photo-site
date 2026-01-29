'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function LoginButton() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    
    
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if(token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleClick = () => {
        if(isLoggedIn) { // 로그아웃 버튼 클릭 시
            localStorage.removeItem('accessToken');
            setIsLoggedIn(false);
            alert('성공적으로 로그아웃되었습니다.');
            router.refresh(); // 페이지 상태 새로고침
        } else { // 로그인 버튼 클릭 시
            router.push('/login');
        }
    }

    return (
        <>
            <input
                type="button"
                onClick={handleClick}
                value={isLoggedIn ? '로그아웃' : '로그인'}
                className="text-center w-[100px] h-[40px] bg-[#ffe500] border-solid rounded-[30px] text-[16px] font-bold text-black cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#ffdd00]"
              />
        </>
    );
}

export default LoginButton;