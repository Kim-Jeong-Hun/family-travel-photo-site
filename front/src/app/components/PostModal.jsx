/*
    main 페이지의 마커의 "이 장소 저장하기" 버튼 클릭 시
    사진 여러 장과 내용을 입력할 수 있는 모달 창 구현하는 것이 목표
    모달 창은 동적으로 나타날 것이므로 .css 파일 만들어 사용
*/

"use client";
import React, { useState } from 'react';
import '../styles/PostModal.css';

function PostModal({ isOpen, onClose, placeName, placeAddress }) {
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

  // Modal이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            새 글 작성
          </h2>
          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            ✕
          </button>
        </div>
        
        {/* 위치 정보 표시 */}
        {placeName && (
          <div className="location-info">
            <p className="location-label">📍 이 장소가 맞나요? 📍</p>
            <p className="location-name">{placeName}</p>
            {placeAddress && (
              <p className="location-address">{placeAddress}</p>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="modal-form">
          {/* 사진 선택 폼 (File Input) */}
          <div className="form-group">
            <label 
              htmlFor="image" 
              className="form-label"
            >
              커버 사진 (선택)
            </label>
            <input 
              type="file" 
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {/* 이미지 미리보기 */}
            {imagePreview && (
              <div className="image-preview-container">
                <img 
                  src={imagePreview} 
                  alt="선택한 이미지 미리보기" 
                  className="image-preview"
                />
              </div>
            )}
          </div>
          
          {/* 여러 줄 입력 폼 (Textarea) */}
          <div className="form-group">
            <label 
              htmlFor="content" 
              className="form-label"
            >
              내용
            </label>
            <textarea 
              id="content"
              name="content"
              rows="6"
              className="form-textarea"
              placeholder="여기에 내용을 입력하세요..."
            ></textarea>
          </div>
          
          {/* 제출 버튼 */}
          <div className="form-group">
            <button 
              type="submit"
              className="submit-btn"
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