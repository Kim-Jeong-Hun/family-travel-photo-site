"use client";
import React, { useState } from "react";
import Link from 'next/link';

function RegisterForm1() {
    const [selectedGender, setSelectedGender] = useState(null);
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

  return (
      <div className="h-screen w-full bg-[url('/images/login-bg.jpg')] bg-cover bg-center opacity-80 flex items-center justify-center">
        <div className="p-8 mb-[5%] w-[75%] max-w-sm h-[80%] text-center">
          <h2 className="mt-[10%] text-center">
            <u>회원가입</u>
          </h2>
          {/* 로그인 폼 스타일*/}
          <div className="mt-[7%] flex flex-col gap-4 items-center justify-center">
            <form name="loginform" method="get" action="">
              {/* 이름 필드*/}
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해 주세요."
                className="w-[280px] h-[40px] my-[20px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
              />
              {/* 성별 선택 필드*/}
              <div className="my-[20px] flex flex-row items-center justify-center bg-[#FFF] border border-[#ccc] rounded-full outline-none box-border">
                <label
                  htmlFor="male"
                  className={`w-[140px] h-[40px] flex items-center justify-center cursor-pointer 
                    ${
                      selectedGender === "male"
                        ? "!bg-blue-500 !text-white !shadow-lg !shadow-blue-300"
                        : "!bg-gray-100 !text-gray-700 !hover:bg-blue-100"
                    }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    id="male"
                    value="male"
                    className="hidden"
                    onChange={() => {setSelectedGender("male")}
                  }
                    checked={selectedGender === "male"}
                  />
                  남성
                </label>
                <label
                  htmlFor="female"
                  className={`w-[140px] h-[40px] flex items-center justify-center cursor-pointer 
                    ${
                      selectedGender === "female"
                        ? "!bg-blue-500 !text-white !shadow-lg !shadow-blue-300"
                        : "!bg-gray-100 !text-gray-700 !hover:bg-blue-100"
                    }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    id="female"
                    value="female"
                    className="hidden"
                    onChange={() => setSelectedGender("female")}
                    checked={selectedGender === "female"}
                  />
                  여성
                </label>
              </div>
              {/* 이메일, 비밀번호, 비밀번호 확인 필드*/}
              <input
                type="email"
                name="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="사용하실 아이디를 입력해 주세요."
                className="w-[280px] h-[40px] my-[20px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="사용하실 비밀번호를 입력해 주세요."
                className="w-[280px] h-[40px] mb-[20px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
              />
              <input
                type="password"
                placeholder="비밀번호를 한 번 더 입력해 주세요."
                className="w-[280px] h-[40px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
              />
              <input
                type="submit"
                value="회원가입"
                className="mb-[10px] mt-[40px] w-[280px] h-[45px] bg-[#ffe500] border-none rounded-[30px] text-[16px] font-bold text-black cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#ffdd00]"
              />
              <div>
                <Link href="/login" className="underline text-[#FFF]">
                  로그인하기
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}

export default RegisterForm1;


/* 
1. "회원가입이 완료되었습니다." 알림창 만들기. 
2. 알림창의 확인 버튼 클릭 이후 로그인 페이지로 라우팅하기
*/