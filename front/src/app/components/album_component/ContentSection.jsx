"use client";

import TextSection from './TextSection';
import PhotoSection from './PhotoSection';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// DateSection에서 선택한 날짜를 받아 토큰을 전달하고 그 게시글 정보를 받아오는 함수 (queryFn)
// 게시글은 한 개씩만 가져오며, 다음 페이지 버튼 클릭 시 다음 게시글 정보 가져옴.
// TextSection에 전달할 것 : 날짜(selectedDate, 상위 컴포넌트로부터 props로 받음), 장소(placeName), 주소(placeAddress)
// PhotoSection에 전달할 것 : 이미지 경로들(imageUrl), 게시글(Content)
const getPosts = async (selectedDate) => {
    const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get("https://family-travel-photo-site.onrender.com/apis/album/individual/posts", {
      headers : {
        Authorization : `Bearer ${token}`
      },
      // 데이터베이스의 게시글 조회하기 위해 서버에 날짜 전달
      params : {
        selectedDate: selectedDate
      }
    });
    console.log("Response:", response.data);
    
    // success가 false면 에러
    if (!response.data.success) {
      throw new Error(response.data.message || "날짜 조회 실패");
    }
    
    return response.data.data; 
  } catch (error) {
    console.error("getPosts Error:", error);
    throw error;
  }
}

function ContentSection({ selectedDate }) {
    // pagination용 상태 변수
    const [page, setPage] = useState(1);

    const { data } = useQuery({
        queryKey: ['post', 'selectedDate', 'page'],
        queryFn: () => getPosts(selectedDate),

        // 게시글 수정과 삭제 기능이 없으므로 항상 신선한 데이터
        staleTime: Infinity,
        gcTime: Infinity
    });

    // 컴포넌트의 상단과 하단에 회색 점선 하나씩
    // 게시글의 날짜,장소,주소를 나타내는 TextSection
    // 게시글의 이미지를 보여주는 PhotoSection
    // 페이지 이동을 위한 <, > 버튼 구현
    // 현재 페이지가 1이면 < 버튼이 렌더링되지 않음.
    return(
        <div>
            <hr className="border-[#B3B3B3] border-dashed " />
                <div>
                    <TextSection 
                        selectedDate={selectedDate} 
                        placeName={"대연동"} 
                        placeAddress={"부산광역시 남구 수영로 346번길 8"}
                    />
                    <PhotoSection 
                        />
                </div>
            <hr className="border-[#B3B3B3] border-dashed " />
            <div className="flex flex-row justify-between items-center mt-[15px]">
                <div className="w-[30px] text-center bg-[#D9D9D9]">
                  {page > 1 && (
                    <div 
                      onClick={() => setPage(page-1)}
                      className="cursor-pointer"
                    >
                      {"<"}
                    </div>
                  )}
                </div>
                <p className="text-center">{page}</p>
                <div className="w-[30px] text-center cursor-pointer bg-[#D9D9D9]" onClick={() => setPage(page+1)}>{">"}</div>
            </div>
        </div>
    );
}

export default ContentSection;


// 데이터가 패칭되면 위아래로 회색 점선 렌더링 (절취선 느낌)