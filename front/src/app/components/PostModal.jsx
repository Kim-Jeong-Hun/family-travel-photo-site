/*
 * 한 줄 입력창(input)과 여러 줄 입력창(textarea)이 포함된
 * placeholder가 있는 React 폼 컴포넌트입니다.
 * Tailwind CSS로 스타일링되었습니다.
 */

/*
    main 페이지의 마커의 "이 장소 저장하기" 버튼 클릭 시
    사진 여러 장과, 제목, 내용을 입력할 수 있는 모달 창 구현하는 것이 목표
*/

"use client";
import React, { useState } from 'react';

function PostModal() {
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기 URL 상태

  // 폼 제출 시 실행될 함수 (기본 동작 방지)
  const handleSubmit = (event) => {
    event.preventDefault();
    // 폼 데이터 처리 로직을 여기에 추가할 수 있습니다.
    // 예: console.log('폼 제출됨');
  };

  // 파일 입력 변경 시 실행될 핸들러
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 선택된 파일의 URL을 생성하여 상태에 저장
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          새 글 작성 (React)
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 사진 선택 폼 (File Input) */}
          <div>
            <label 
              htmlFor="image" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              커버 사진 (선택)
            </label>
            <input 
              type="file" 
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100
                         cursor-pointer"
            />
            {/* 이미지 미리보기 */}
            {imagePreview && (
              <div className="mt-4">
                <img 
                  src={imagePreview} 
                  alt="선택한 이미지 미리보기" 
                  className="w-full h-auto max-h-64 object-cover rounded-md shadow-md"
                />
              </div>
            )}
          </div>

          {/* 한 줄 입력 폼 (Input) */}
          <div>
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              제목
            </label>
            <input 
              type="text" 
              id="title"
              name="title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="제목을 입력하세요..."
            />
          </div>
          
          {/* 여러 줄 입력 폼 (Textarea) */}
          <div>
            <label 
              htmlFor="content" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              내용
            </label>
            <textarea 
              id="content"
              name="content"
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="여기에 내용을 입력하세요..."
            ></textarea>
          </div>
          
          {/* 제출 버튼 */}
          <div>
            <button 
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostModal;