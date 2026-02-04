/*
<album.js>
1. /individual/date - 개인 앨범 사진 저장 날짜 가져오는 api
2. /individual/posts - 개인 앨범 게시글 정보 모두 가져오는 api
*/

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const supabase = require("../supabase_setting.js"); // supabase 설정 불러오기


// "내 앨범" 페이지의 DateSection용 (저장된 게시글 날짜 가져오는 api)
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


// "내 앨범" 페이지의 ContentSection용 (저장된 게시글 날짜 가져오는 api)
router.get("/individual/posts", async (req, res) => {
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

    // params가 없으면 400 (Bad Request) 리턴
    if (!params) {
      return res.status(400).json({ success: false });
    }

    // 프론트에서 params로 전달한 정보 받기
    // selectedDate : 
    // page : 
    const selectedDate = req.params.selectedDate;
    const post_id = req.params.page;


    // 가져올 데이터 : 장소, 주소, 글, 이미지 경로
    // posts(place_name, place_address, content)
    // post_images(image_url)
    // 배열 내부에 객체가 담긴 형태
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("content", "place_name, place")
      .eq("user_id", user_id)
      .eq("created_at", selectedDate)
      .order("created_at", { ascending: false }); // 최신순으로

    if (postsError) throw postsError;

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
router.get("/family", async (req, res) => {
  
});

module.exports = router;