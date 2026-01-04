import { useState } from "react";

export default function GenderSelector() {
  const [selectedGender, setSelectedGender] = useState(null);

  return (
    <div className="flex gap-4">
      {/* 남성 */}
      <label
        htmlFor="male"
        className={`cursor-pointer px-6 py-3 rounded-xl transition-all duration-300 font-semibold 
          ${selectedGender === "male"
            ? "bg-blue-500 text-white shadow-lg shadow-blue-300"
            : "bg-gray-100 text-gray-700 hover:bg-blue-100"}`}
      >
        <input
          type="radio"
          id="male"
          name="gender"
          value="male"
          className="hidden"
          onChange={() => setSelectedGender("male")}
        />
        남성
      </label>

      {/* 여성 */}
      <label
        htmlFor="female"
        className={`cursor-pointer px-6 py-3 rounded-xl transition-all duration-300 font-semibold 
          ${selectedGender === "female"
            ? "bg-pink-500 text-white shadow-lg shadow-pink-300"
            : "bg-gray-100 text-gray-700 hover:bg-pink-100"}`}
      >
        <input
          type="radio"
          id="female"
          name="gender"
          value="female"
          className="hidden"
          onChange={() => setSelectedGender("female")}
        />
        여성
      </label>
    </div>
  );
}
