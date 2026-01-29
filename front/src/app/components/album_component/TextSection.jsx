function TextSection({ uploadDate, placeName, placeAddress }) {
  return (
    <div>
      <p>
        <span className="text-left text-[30px] font-[700]">
          {uploadDate}2025.09.29
        </span>
        <span className="text-[30px]"> | </span>
        <span className="text-[25px] font-[500]">{placeName}대연동</span>
      </p>
      <p>
        <span className="text-[15px] text-[#9A9A9A]">
          {placeAddress}부산광역시 남구 수영로 309
        </span>
      </p>
    </div>
  );
}

export default TextSection;
