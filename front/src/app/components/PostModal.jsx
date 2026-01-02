/*
main 페이지의 마커의 "이 장소 저장하기" 버튼 클릭 시
사진 여러 장과 내용을 입력할 수 있는 모달 창 구현하는 것이 목표
모달 창은 동적으로 나타날 것이므로 .css 파일 만들어 사용
*/

/*
프론트에서 서버의 서명(Signature)을 받아 직접 스토리지로 업로드하는 Signed Upload 방식 사용
axios로 서버에 요청을 보내어 서명 받아온 후(getCloudinarySignature()), 
직접 업로드하는 로직 필요(handleSubmit())
*/

"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/PostModal.css';

// main페이지의 page.js에서 props로 열리고 닫힌 상태와 장소, 주소, 위도, 경도 전달받음.
function PostModal({ isOpen, onClose, placeName, placeAddress, lat, lng }) {
  const [imageFiles, setImageFiles] = useState([]); // 실제 파일 객체 저장
  const [imagePreviews, setImagePreviews] = useState([]); // 이미지 미리보기 URL 상태 (배열)
  const [isUploading, setIsUploading] = useState(false); // 업로드 로딩 상태 추가

  // 모달이 닫힐 때 메모리 해제
  useEffect(() => {
    return() => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [isOpen]);

  // Axios를 사용하여 발급받은 token을 다시 서버에 보내어 신원을 확인하고
  // Cloudinary Signature 서명 요청하는 로직
  // Bearer token :소지(bear)한 사람이 권한을 가지는 토큰
  const getCloudinarySignature = async (token) => {
    try {
      // 서버에 토큰 전달하여 사용자 확인
      const response = await axios.post(
        'https://family-travel-photo-site.onrender.com/apis/post/signature',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      console.log('Signature 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('Signature 요청 오류:', error);
      throw error;
    }
  };

  // Cloudinary Signature 받아와서 업로드하는 로직
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // 사진이 없으면 업로드 중지
    if(imageFiles.length === 0) {
      alert('최소 1장 이상의 사진을 선택해주세요.');
      return;
    }

    // 내용이 없으면 업로드 중지
    const contentValue = event.target.content.value;
    if(!contentValue || !contentValue.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (isUploading) return; // 이미 업로드 중이면 중단
    setIsUploading(true); // 로딩 시작

    try {

      // Cloudinary 환경 변수 받아오기
      const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const api_key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
      console.log("Cloud Name:", cloud_name);

      // 1. 토큰 보내고 서명 요청하여 받아오기
      const token = localStorage.getItem("accessToken");
      const { signature, timestamp, folder } = await getCloudinarySignature(token);

      // 2. 여러 장의 사진을 동시에 Cloudinary로 업로드
      // 이후 URL 배열 생성
      const imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', api_key); // api키
          formData.append('timestamp', timestamp); // 유효기간
          formData.append('signature', signature); // 서명
          formData.append('folder', folder); // 폴더 이름

          const uploadRespond = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            formData
          );
          
          return uploadRespond.data.secure_url; // 업로드된 이미지 url 반환 (서버에 전달 위해 필요)
      })
    );

    // 3. 최종 데이터를 서버에 전송
    const postData = {
      placeName,
      placeAddress,
      content: event.target.content.value,
      imageUrls: imageUrls, // [url1, url2, ...] 과 같은 배열 형태
      latitude: lat,
      longitude: lng
    };

    await axios.post('https://family-travel-photo-site.onrender.com/apis/post', 
      postData,
      { 
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    alert('게시글이 성공적으로 저장되었습니다!');
    onClose();

  } catch (error) {
    // 토큰 만료시, 로그인 페이지로 리다이렉트하는 로직 추가
    if(error.response?.status == 401) {
      alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    alert('업로드 중 오류가 발생했습니다.');
  } finally {
    setIsUploading(false);
  }
};

  // 파일 입력 변경 시 실행될 핸들러
  const handleImageChange = (event) => {
  const files = event.target.files;
  if(!files) return;

  let selectedFiles = Array.from(files);

  // 1. 이미지가 아닌 파일 선택 제한
  const isAllImages = selectedFiles.every(file => file.type.startsWith('image/'));
  if(!isAllImages) {
    alert('이미지 파일만 업로드 가능합니다.');
    event.target.value = null;
    return;
  }

  // 2. 이미지 개수 제약
  if(selectedFiles.length > 10) {
    alert('이미지는 최대 10장까지 업로드할 수 있습니다.');
    selectedFiles = selectedFiles.slice(0, 10);
  }

  // 미리보기 상태 업데이트
  setImageFiles(selectedFiles);

  const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));

  // 메모리 해제 (기존 URL 정리)
  imagePreviews.forEach(url => URL.revokeObjectURL(url));
  setImagePreviews(previewUrls);

  event.target.value = null;
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
              multiple
              onChange={handleImageChange}
              className="file-input"
            />
            {/* 이미지 미리보기 */}
            {imagePreviews.length > 0 && (
              <div className="image-preview-container">
                {imagePreviews.slice(0, 5).map((preview, index) => (
                  <img 
                    key={index}
                    src={preview} 
                    alt={`선택한 이미지 미리보기 ${index + 1}`} 
                    className="image-preview"
                  />
                ))}
                <p className="image-limit-notice">미리보기는 최대 5개까지만 표시됩니다. <br /> (총 {imagePreviews.length}/10개 선택됨)</p>
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
              disabled={isUploading}
            >
              {isUploading ? '업로드 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostModal;