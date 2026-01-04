const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const supabase = require("../supabase_setting"); // supabase 설정 불러오기

router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // Bearer와 token 구조 분해 할당
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false });
    }

    const token = authHeader.split(" ")[1];

    // JWT 검증
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = payload.uid;

    // 유저 닉네임 받아오기
    const { data: userData, error: dbError } = await supabase
      .from("users")
      .select("nickname")
      .eq("user_id", user_id)
      .maybeSingle();

    if (dbError) throw dbError;

    return res.status(200).json({
      success: true,
      nickname: userData ? userData.nickname : null,
    });
  } catch (error) {
    console.log("Profile API Error: ", error.message);

    // 토큰 만료 및 유효하지 않은 토큰 처리
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "유효하지 않은 토큰입니다." });
    }

    // 서버 내부 에러
    return res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
