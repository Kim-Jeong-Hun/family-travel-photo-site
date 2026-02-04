/*
<TextSection>
- 상위 컴포넌트(ContentSection)로부터 
날짜(selectedDate), 장소(placeName), 주소(placeAddress) 받아와서 렌더링 
*/

function TextSection({ selectedDate, placeName, placeAddress }) {
  return (
    <div className="mt-[15px]">
      <p>
        <span className="text-left text-[20px] font-[700]">
          {selectedDate}
        </span>
        {selectedDate && placeName && <span className="text-[20px]"> | </span>}
        <span className="text-[15px] font-[500]">{placeName}</span>
      </p>
      <p>
        <span className="text-[13px] text-[#9A9A9A]">
          {placeAddress}
        </span>
      </p>
    </div>
  );
}

export default TextSection;
