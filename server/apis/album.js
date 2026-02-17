/*
<album.js>
1. /individual/date - 개인 앨범 사진 저장 날짜 가져오는 api
2. /individual/posts - 개인 앨범 게시글 정보 모두 가져오는 api
*/

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const supabase = require("../supabase_setting.js"); // supabase 설정 불러오기
const cloudinary = require('../cloudinary_setting'); // cloudinary 설정 불러오기

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
    const uniqueDates = [
      ...new Set(postsDatesData.map((post) => post.created_at.split("T")[0])),
    ];

    // 중복된 날짜 제거한 데이터 리턴
    return res.status(200).json({
      success: true,
      data: uniqueDates,
    });
  } catch (error) {
    console.log("Album API Error: ", error.message);
  }
});

// "내 앨범" 페이지의 ContentSection용 (저장된 게시글 날짜 가져오는 api)
router.get("/individual/posts", async (req, res) => {
  try {
    // 1. 권한 확인
    // 토큰이 전달되지 않았다면 401 (Unauthorized) 리턴
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false,
        message: "토큰이 필요합니다."
      });
    }

    const token = authHeader.split(" ")[1];

    // JWT 검증
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = payload.uid;
    
    // 프론트에서 전달한 params 받기
    // (selectedDate : 선택한 날짜)
    // (page : 현재 페이지)
    const { selectedDate, page } = req.query;
    
    // selectedDate와 page가 없으면 400 (Bad Request) 리턴
    if (!selectedDate || !page) {
      return res.status(400).json({ 
        success: false,
        message: "날짜와 페이지 정보가 없습니다."
      });
    }
    
    // range 계산용 pageNum
    const pageNum = parseInt(page);

    // 2. 데이터베이스에서 데이터 가져오기
    // 가져올 데이터 : 장소, 주소, 작성한 글, 이미지 경로 (게시글에 들어있는 모든 경로)
    // posts(place_name, place_address, content)
    // post_images(image_url)
    // count : 전체 게시글 수 (프론트 리턴용)
    const { data, error, count } = await supabase
      .from("posts")
      .select("place_name, place_address, content, post_images(image_url)", { count: 'exact' })
      .eq("user_id", user_id)
      .gte("created_at", `${selectedDate}T00:00:00`) // 해당 날짜의 00시 00분 00초보다 크거나 같고
      .lte("created_at", `${selectedDate}T23:59:59`) // 해당 날짜의 23시 59분 59초보다 작거나 같게
      .order("created_at", { ascending: false }) // 최신순으로
      .range(pageNum - 1, pageNum - 1); // range는 0부터 시작하므로 1뺌

      console.log("count :", count);
    
    if (error) throw error;

    return res.status(200).json({
      success: true,
      post: data[0],
      totalCount: count // 전체 게시글 수 전달
    })



  } catch (error) {
    console.error("에러 발생: ", error);
    return res.status(500).json({
      success: false,
      message: "서버 에러"
    });
  }
});

// "우리 가족 앨범 페이지"용 api <= 추후 추가
router.get("/family", async (req, res) => {});

module.exports = router;
