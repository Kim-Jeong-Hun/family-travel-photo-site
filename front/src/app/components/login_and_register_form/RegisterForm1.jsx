"use client";
import React, { useState } from "react";
import Link from 'next/link';
import axios from 'axios'; // HTTP 요청을 위한 라이브러리 - 백엔드 API와 통신
import { useRouter } from 'next/navigation'; // Next.js 라우팅을 위한 훅

function RegisterForm1() {
    const router = useRouter(); // 페이지 이동을 위한 라우터 인스턴스
    
    // ===== 폼 입력 값 상태 관리 =====
    const [selectedGender, setSelectedGender] = useState(null); // 선택된 성별 (male/female)
    const [name, setName] = useState(""); // 사용자 이름
    const [id, setId] = useState(""); // 사용자 아이디
    const [password, setPassword] = useState(""); // 사용자 비밀번호
    const [passwordCheck, setPasswordCheck] = useState(""); // 비밀번호 확인 입력값
    
    // ===== UI 상태 관리 =====
    const [loading, setLoading] = useState(false); // API 요청 중 여부
    const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 표시

    // ===== 회원가입 처리 함수 =====
    const handleRegister = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지
        setErrorMessage(""); // 이전 에러 메시지 초기화
        
        // 필수 입력값 검증
        if (!name || !selectedGender || !id || !password || !passwordCheck) {
            setErrorMessage("모든 항목을 입력해주세요.");
            return;
        }

        // 비밀번호 일치 여부 검증
        if (password !== passwordCheck) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        setLoading(true); // API 요청 시작 - 버튼 비활성화

        try {
            // 백엔드 회원가입 API에 POST 요청 전송
            const response = await axios.post(
                'https://family-travel-photo-site.onrender.com/apis/signup',
                {
                    name: name,
                    gender: selectedGender,
                    id: id,
                    password: password,
                    password_check: passwordCheck
                }
            );

            // 회원가입 성공 시 처리
            if (response.data.success) {
                alert("회원가입이 완료되었습니다.");
                router.push("/login"); // 로그인 페이지로 자동 이동
            }
        } catch (err) {
            // 회원가입 실패 시 에러 메시지 표시
            const errorMsg = err.response?.data?.message || "회원가입에 실패했습니다.";
            setErrorMessage(errorMsg);
            console.error("회원가입 오류:", err);
        } finally {
            setLoading(false); // API 요청 완료 - 버튼 활성화
        }
    };

    return (
      <div className="h-screen w-full bg-[url('/images/login-bg.jpg')] bg-cover bg-center opacity-80 flex items-center justify-center">
        <div className="p-8 mb-[5%] w-[75%] max-w-sm h-[80%] text-center">
          {/* 회원가입 페이지 제목 */}
          <h2 className="mt-[10%] text-center">
            <u>회원가입</u>
          </h2>
          
          {/* 회원가입 폼 컨테이너 */}
          <div className="mt-[7%] flex flex-col gap-4 items-center justify-center">
            <form name="loginform" method="POST" onSubmit={handleRegister}> {/* 폼 제출 시 handleRegister 함수 실행 */}
              
              {/* ===== 이름 입력 필드 ===== */}
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해 주세요."
                className="w-[280px] h-[40px] my-[20px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
              />
              
              {/* ===== 성별 선택 필드 ===== */}
              <div className="my-[20px] flex flex-row items-center justify-center bg-[#FFF] border border-[#ccc] rounded-full outline-none box-border gap-2 overflow-hidden">
                {/* 남성 선택 버튼 */}
                <label
                  htmlFor="male"
                  className="w-[140px] h-[40px] flex items-center justify-center cursor-pointer rounded transition-all duration-300"
                  style={{
                    backgroundColor: selectedGender === "male" ? "#3b82f6" : "#f3f4f6",
                    color: selectedGender === "male" ? "white" : "#374151",
                    boxShadow: selectedGender === "male" ? "0 20px 25px -5px rgba(59, 130, 246, 0.3)" : "none"
                  }}
                >
                  <input
                    type="radio"
                    name="gender"
                    id="male"
                    value="male"
                    className="hidden"
                    onChange={() => setSelectedGender("male")}
                    checked={selectedGender === "male"}
                  />
                  남성
                </label>
                
                {/* 여성 선택 버튼 */}
                <label
                  htmlFor="female"
                  className="w-[140px] h-[40px] flex items-center justify-center cursor-pointer rounded transition-all duration-300"
                  style={{
                    backgroundColor: selectedGender === "female" ? "#ec4899" : "#f3f4f6",
                    color: selectedGender === "female" ? "white" : "#374151",
                    boxShadow: selectedGender === "female" ? "0 20px 25px -5px rgba(236, 72, 153, 0.3)" : "none"
                  }}
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
              
              {/* ===== 아이디 입력 필드 ===== */}
              <input
                type="text"
                name="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="사용하실 아이디를 입력해 주세요."
                className="w-[280px] h-[40px] my-[20px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
              />
              
              {/* ===== 비밀번호 입력 필드 ===== */}
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="사용하실 비밀번호를 입력해 주세요."
                className="w-[280px] h-[40px] mb-[20px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
              />
              
              {/* ===== 비밀번호 확인 입력 필드 ===== */}
              <input
                type="password"
                name="password_check"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                placeholder="비밀번호를 한 번 더 입력해 주세요."
                className="w-[280px] h-[40px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
              />
              
              {/* ===== 회원가입 제출 버튼 ===== */}
              {/* loading 상태에 따라 버튼 텍스트 변경 및 비활성화 */}
              <input
                type="submit"
                value={loading ? "처리 중..." : "회원가입"}
                disabled={loading}
                className="mb-[10px] mt-[40px] w-[280px] h-[45px] bg-[#ffe500] border-none rounded-[30px] text-[16px] font-bold text-black cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#ffdd00] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              
              {/* ===== 에러 메시지 표시 영역 ===== */}
              {/* errorMessage가 있을 때만 렌더링 */}
              {errorMessage && (
                <div className="mt-[20px] p-3 bg-red-100 border border-red-400 text-red-700 rounded text-[14px]">
                  {errorMessage}
                </div>
              )}
              
              {/* ===== 로그인 페이지 링크 ===== */}
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