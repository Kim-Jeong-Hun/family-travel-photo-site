import React from "react";

const PhotoModal = ({ isOpen, photoUrl, caption, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* 1. 배경: 클릭 시 닫힘 + 어둡게 + 블러 처리 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* 2. 모달 바디: 폴라로이드 스타일 */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* 닫기 버튼 (우측 상단) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
        >
          ✕
        </button>

        {/* 이미지 영역 */}
        <div className="flex items-center justify-center bg-gray-50">
          <img
            src={photoUrl}
            alt="확대한 사진이 표시될 영역입니다."
            className="max-h-[70vh] w-full object-contain"
          />
        </div>

        {/* 하단 캡션 영역 (폴라로이드 감성) */}
        <div className="p-6 bg-white border-t border-gray-100">
          <p className="text-lg font-medium text-gray-800 leading-relaxed text-center">
            {caption || "게시글이 표시될 영역입니다."}
          </p>

          {/* 장식용 날짜 혹은 추가 정보 (선택 사항) */}
          <div className="mt-4 flex justify-center opacity-30">
            <div className="h-1 w-12 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
