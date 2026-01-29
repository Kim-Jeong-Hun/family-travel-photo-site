/*
<앨범 페이지의 컴포넌트 구조>
- DateSection
- InfiniteList(DateSection으로부터 날짜를 받아 데이터 패칭할 컴포넌트)
  - ContentContainer
    - TextSection (UI 렌더링)
    - PhotoSection (UI 렌더링)
- PhotoModal
*/ 

import DateSection from "../components/album_component/DateSection";
import ContentContainer from "../components/album_component/ContentContainer";
import PhotoModal from "../components/album_component/PhotoModal";
import TextSection from "../components/album_component/TextSection";
import PhotoSection from "../components/album_component/PhotoSection";

function Album_page() {
  return (
    <div>
      <DateSection />
      <ContentContainer>
        <TextSection />
        <PhotoSection />
      </ContentContainer>
      <PhotoModal />
    </div>
  );
}

export default Album_page;
