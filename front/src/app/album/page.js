/*
<앨범 페이지의 컴포넌트 구조>
앨범 페이지 최상위에서 상태 관리하여 DateSection과 ContentSection에 전달
- DateSection (게시글의 날짜 선택)
- ContentContainer (날짜 전달받아 게시글 정보 fetching)
  - TextSection (UI 렌더링)
  - PhotoSection (UI 렌더링)
- PhotoModal
*/

"use client";

import DateSection from "../components/album_component/DateSection";
import ContentSection from "../components/album_component/ContentSection";
import PhotoModal from "../components/album_component/PhotoModal";
import TextSection from "../components/album_component/TextSection";
import PhotoSection from "../components/album_component/PhotoSection";
import { useState } from 'react';


function Album_page() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div>
      <DateSection onSelect={setSelectedDate} />
      <ContentSection selectedDate={selectedDate}>
        <TextSection />
        <PhotoSection />
      </ContentSection>
      <PhotoModal />
    </div>
  );
}

export default Album_page;
