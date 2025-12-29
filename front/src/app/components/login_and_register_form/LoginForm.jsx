"use client";
import React, { useState } from "react";
import Link from 'next/link';
import axios from 'axios';

function LoginForm() {
  const [id, setId] = useState(''); // 사용자 아이디
  const [password, setPassword] = useState(''); // 사용자 비밀번호
  const [loading, setLoading] = useState(false); // API 요청 중 여부

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 로딩 시작
    try {
      //로그인 로직
      const response = await axios.post('https://family-travel-photo-site.onrender.com/apis/login',
        {
          id: id,
          password: password
        },
      );

      const { success, message, token } = response.data;

      if(success) {
        localStorage.setItem('accessToken', token); // 서버에서 받은 JWT 토큰을 로컬 스토리지에 저장
        console.log(message); // 성공적으로 로그인되었습니다.
        alert('성공적으로 로그인되었습니다!');
        window.location.href = "/main";
      }
    } catch (error) {
      if (error.response) {
        console.error('로그인 실패:', error.response.data.message);
        alert(error.response.data.message);
      } else {
        alert('서버와 연결할 수 없습니다.');
      }
    } finally {
      setLoading(false); // 성공 또는 실패 시 모두 로딩 종료
    }
  }


  return (
      <div className="h-screen w-full bg-[url('/images/login-bg.jpg')] bg-cover bg-center opacity-80 flex items-center justify-center">
        <div className="p-8 mb-[5%] w-[75%] max-w-sm h-[80%] text-center">
          <div>
            <img
              src="/images/login-logo.png"
              alt="여기담다"
              className="w-20 mx-auto"
            />
          </div>

          <div className="flex flex-col gap-4 mt-[25%] items-center justify-center">
            <form name="loginform" onSubmit={handleSubmit}>
              <input
                type="text"
                name="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="아이디"
                className="w-[280px] h-[40px] mt-[10px] mb-[5px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
                required
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-[280px] h-[40px] mb-[10px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
                required
              />
              <div>
                <Link href="/signup" className="underline text-[#FFF]">
                  회원가입
                </Link>
                <a className="text-[#FFF]"> / </a>
                <Link href="/change-password" className="underline text-[#FFF]">
                  비밀번호 변경
                </Link>
              </div>
              <input
                type="submit"
                value={loading ? '로그인 중...' : "로그인"}
                disabled={loading}
                className="mt-[30px] w-[280px] h-[45px] bg-[#ffe500] border-none rounded-[30px] text-[16px] font-bold text-black cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#ffdd00]"
              />
            </form>
          </div>
        </div>
      </div>
  );
}

export default LoginForm;
