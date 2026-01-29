/*
<album.js>
1. album/individual/date - 개인 앨범 사진 저장 날짜 가져오는 api
2. 
*/


const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const supabase = require("../supabase_setting.js"); // supabase 설정 불러오기


// "내 앨범" 페이지용 api
router.get("/individual/dates", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // 토큰이 전달되지 않았다면 401 (Unauthorized) 리턴
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false });
    }

    const token = authHeader.split(" ")[1];
    
    // JWT 검증
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = payload.uid;

    // 가져올 데이터 : posts(created_at) (최신순으로)
    // 배열 내부에 객체가 담긴 형태
    const { data: postsDatesData, error: postsDatesError } = await supabase
      .from("posts")
      .select("created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false }); // 최신순으로

    if (postsDatesError) throw postsDatesError;

    // 중복된 날짜 제거하고 날짜 형식만 추출 (YYYY-MM-DD)
    // created_at형식 : "2025-01-25T10:30:00"
    const uniqueDates = [...new Set(
      postsDatesData.map(post => post.created_at.split('T')[0])
    )];

    // 중복된 날짜 제거한 데이터 리턴
    return res.status(200).json({
        success: true,
        data: uniqueDates
    }); 
    
  } catch (error) {
    console.log("Album API Error: ", error.message);
  }
});


// "우리 가족 앨범 페이지"용 api <= 추후 추가
router.get("/group", async (req, res) => {
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

    // 가져올 데이터 : posts(post_id, place_name, place_address, content, created_at)
    // post_images(post_id, image_url, image_order)
    // 데이터를 가져오기 위해 두 테이블을 조인
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("place_name, place_address, content, created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (postsError) throw postsError;

    return res.status(200).json({
        success: true,
        data: postsData
    }); 
    
  } catch (error) {
    console.log("Album API Error: ", error.message);

    // 토큰 만료 및 유효하지 않은 토큰 처리
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ success: false, message: "유효하지 않은 토큰입니다." });
    }

    // 서버 내부 에러
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
