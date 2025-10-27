"use client";
import React from "react";
import Link from 'next/link';

function LoginForm() {

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // ... 로그인 로직 ...
      window.location.href = "/main"
    } catch (error) {
      console.error("Login failed:", error);
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
                type="email"
                placeholder="아이디"
                className="w-[280px] h-[40px] mt-[10px] mb-[5px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
              />
              <input
                type="password"
                placeholder="비밀번호"
                className="w-[280px] h-[40px] mb-[10px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
              />
              <div>
                <Link href="/register" className="underline text-[#FFF]">
                  회원가입
                </Link>
                <a className="text-[#FFF]"> / </a>
                <Link href="/find-password" className="underline text-[#FFF]">
                  비밀번호 찾기
                </Link>
              </div>
              <input
                type="submit"
                value="로그인"
                className="mt-[30px] w-[280px] h-[45px] bg-[#ffe500] border-none rounded-[30px] text-[16px] font-bold text-black cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#ffdd00]"
              />
            </form>
          </div>
        </div>
      </div>
  );
}

export default LoginForm;
