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
  const response = await axios.get("https://family-travel-photo-site.onrender.com/album/individual/dates", {
    headers : {
      Authorization : `Bearer ${token}`
    }
  });
  return response.data.uniqueDatesdata;
}

function DateSection({ onSelect }) {
  // 2. TanStack Query로 데이터 패칭
  // 가져온 데이터 형식 : 
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dateList'],
    queryFn: getUploadDates,
  });

  // 로딩 중일 때 처리
  if (isLoading) return <div>날짜 목록을 불러오는 중...</div>;
  // 에러 발생 시 처리
  if (isError) return <div className="text-[#EE0000]">날짜를 불러오지 못했습니다.</div>;

  return (
    <div>
      <select 
        name="date"
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
