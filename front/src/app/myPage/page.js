"use client";
import { useState, useEffect } from "react";
import axios from "axios";

function My_page() {
  const [isUser, setIsUser] = useState("사용자");

  // 서버에서 사용자 닉네임 불러오는 함수
  const findNickname = async () => {
    const token = localStorage.getItem("accessToken");
    // 토큰이 없으면 종료
    if (!token) return;

    try {
      const response = await axios.post(
        "https://family-travel-photo-site.onrender.com/apis/myPage/profile",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const nickname = response.data.nickname;
      if (nickname) {
        setIsUser();
      }
    } catch (error) {
      console.log("error: ", error);
    } finally {
    }
  };

  useEffect(() => {
    findNickname();
  }, []);

  return (
    <div>
      <p className="mb-[50px] flex justify-center">
        <span className="font-[700] text-[25px] text-[#2268E1] underline">
          {isUser}
        </span>
        <span className="font-[600] self-end">님, 환영합니다!!</span>
      </p>
      <p className="text-[#8F8F8F]">기능은 추후 추가될 예정입니다.</p>
    </div>
  );
}

export default My_page;
