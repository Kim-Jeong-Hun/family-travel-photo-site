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
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PostModal.css';

function PostModal({ isOpen, onClose, placeName, placeAddress }) {
  const [imageFiles, setImageFiles] = useState([]); // 실제 파일 객체 저장
  const [imagePreviews, setImagePreviews] = useState([]); // 이미지 미리보기 URL 상태 (배열)

  // Axios를 사용하여 서버에 Cloudinary Signature 서명 요청하는 로직
  const getCloudinarySignature = async () => {
    try { 
      const response = await axios.post('https://family-travel-photo-site.onrender.com/apis/post/signature');
      console.log('Signature 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('Signature 요청 오류:', error);
      throw error;
    }
  };

  // 서명 받아와서 업로드하는 로직
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // 1. 서명 요청하여 받아오기
      const { signature, timestamp, cloudName, apiKey, folder } = await getCloudinarySignature();

      // 2. 여러 장의 사진을 동시에 Cloudinary로 업로드
      const uploadPromises = imageFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('signature', signature); // 서명
        formData.append('timestamp', timestamp); // 유효기간
        formData.append('api_key', apiKey); // api키
        formData.append('folder', folder); // 폴더 이름

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1${cloudName}/image/upload`,
          formData
        );
        return res.data.secure_url; // 업로드된 이미지 url 반환 (서버에 전달 위해 필요)
      });

      const imageUrls = await Promise.all(uploadPromises);

    // 3. 최종 데이터를 서버에 전송
    const postData = {
      placeName,
      placeAddress,
      content: event.target.content.value,
      images: imageUrls, // [url1, url2, ...] 과 같은 배열 형태
    };

    await axios.post('https://family-travel-photo-site.onrender.com/apis/post', postData);
    alert('성공적으로 저장되었습니다!');
    onClose();

  } catch (error) {
    alert('업로드 중 오류가 발생했습니다.');
  }
};

  // 파일 입력 변경 시 실행될 핸들러
  const handleImageChange = (event) => {
    const files = event.target.files;
    if (files) {
      // 최대 10개까지만 선택 가능
      const selectedFiles = Array.from(files).slice(0, 10);
      setImageFiles(selectedFiles); // 파일 객체 저장
      
      // 선택된 파일들의 URL을 생성하여 상태에 저장 (미리보기용)
      const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      imagePreviews.forEach(url => {
        URL.revokeObjectURL(URL);
      })
      setImagePreviews(previewUrls);
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
                {imagePreviews.length > 5 && (
                  <p className="image-limit-notice">미리보기는 최대 5개까지만 표시됩니다. <br /> (총 {imagePreviews.length}/10개 선택됨)</p>
                )}
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