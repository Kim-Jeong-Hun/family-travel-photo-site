"use client";

import TextSection from "./TextSection";
import PhotoSection from "./PhotoSection";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// DateSection에서 선택한 날짜를 받아 토큰을 전달하고 그 게시글 정보를 받아오는 함수 (queryFn)
// 게시글은 한 개씩만 가져오며, 다음 페이지 버튼 클릭 시 다음 게시글 정보 가져옴.
const getPosts = async (selectedDate, page) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get("https://family-travel-photo-site.onrender.com/apis/album/individual/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // 데이터베이스의 게시글 조회하기 위해 옵션으로 서버에 날짜 전달
      // (가져오는 게시글 수와 정렬은 서버에서 처리)
      params: {
        selectedDate: selectedDate, // 선택한 날짜
        page: page, // 페이지 번호
      },
    },
  );
  console.log("Response:", response.data);

  // success가 false면 에러
  if (!response.data.success) {
    throw new Error(response.data.message || "데이터 조회 실패");
  }

  return response.data;
};

function ContentSection({ selectedDate }) {
  // pagination용 상태 변수
  const [page, setPage] = useState(1);

  // 선택한 날짜가 바뀌면 1페이지로 초기화
  useEffect(() => {
    setPage(1);
  }, [selectedDate]);

  const { data } = useQuery({
    queryKey: ["post", selectedDate, page],
    queryFn: () => getPosts(selectedDate, page),
    staleTime: Infinity, // 항상 신선
    gcTime: Infinity, // 수명 무제한
  });

  const post = data?.post;
  const totalCount = data?.totalCount || 0;

  // 컴포넌트의 상단과 하단에 회색 점선 하나씩
  // 게시글의 날짜,장소,주소를 나타내는 TextSection
  // 게시글의 이미지를 보여주는 PhotoSection
  // 페이지 이동을 위한 <, > 버튼 구현
  // 현재 페이지가 1이면 < 버튼이 렌더링되지 않음.
  return (
    <div>
      {post && (
        <>
          <hr className="border-[#B3B3B3] border-dashed" />
          <br />
          <div>
            <TextSection
              selectedDate={selectedDate}
              placeName={post.place_name}
              placeAddress={post.place_address}
            />
            <br />
            <PhotoSection imageUrls={post.post_images} content={post.content} />
          </div>
          <br />
          <hr className="border-[#B3B3B3] border-dashed " />
        </>
      )}
      <div className="flex flex-row justify-between items-center mt-[15px]">
        <div className="w-[30px] text-center bg-[#D9D9D9]">
          {page > 1 && (
            <div onClick={() => setPage(page - 1)} className="cursor-pointer">
              {"<"}
            </div>
          )}
        </div>
        <p className="text-center">
          {page} / {totalCount}
        </p>
        {/* 다음 버튼: 전체 개수(totalCount)까지만 활성화 */}
        <div className="w-[30px] text-center bg-[#D9D9D9] h-[30px] flex items-center justify-center">
          {page < totalCount && (
            <div
              onClick={() => setPage(page + 1)}
              className="cursor-pointer w-full"
            >
              {">"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContentSection;

// 데이터가 패칭되면 위아래로 회색 점선 렌더링 (절취선 느낌)


// 데이터 패칭 형식
/*

{
  "success": true,
  "post": {
    "place_name": "성수동 카페",
    "place_address": "서울 성동구 어쩌구로 123",
    "content": "오늘 날씨가 너무 좋아서 사진 찍기 좋았어요!",
    "post_images": [
      { "image_url": "https://example.com/storage/v1/image1.jpg" },
      { "image_url": "https://example.com/storage/v1/image2.jpg" }
    ]
  },
  "totalCount": 15
}

*/