/* 
<DateSection>
1. jwt 토큰을 서버에 전달하여 내 게시글의 날짜를 전부 받아오기
2. dropdown에 동적으로 표시하기
*/

"use client";

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 1. 토큰 서버에 전달하고 날짜 목록 가져올 함수 작성 (queryFn)
const getUploadDates = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get("https://family-travel-photo-site.onrender.com/apis/album/individual/dates", {
      headers : {
        Authorization : `Bearer ${token}`
      }
    });
    console.log("Response:", response.data);
    
    // success가 false면 에러
    if (!response.data.success) {
      throw new Error(response.data.message || "날짜 조회 실패");
    }
    
    // 서버에서 response.json({data})로 데이터 받아옴
    return response.data.data; 
  } catch (error) {
    console.error("getUploadDates Error:", error);
    throw error;
  }
}

function DateSection({ onSelect }) {
  // 2. TanStack Query로 데이터 패칭
  const { data } = useQuery({
    queryKey: ['dateList'], 
    queryFn: getUploadDates,
    staleTime: Infinity,  // 데이터를 항상 fresh 상태로 유지하여 자동 refetch 방지
    gcTime: Infinity,     // 가비지 컬렉션 비활성화
  });

  return (
    <div>
      <select 
        // appearance-none : select 태그에 적용된 브라우저 기본 스타일 제거
        className="appearance-none w-[100px] h-[30px] border-solid border-[2px] font-[700] text-center my-5"
        onChange={(e) => onSelect(e.target.value)}>
        <option>날짜 선택</option>
          {data?.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
      </select>
    </div>
  );
}

export default DateSection;