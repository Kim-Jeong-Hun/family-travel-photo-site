const express = require('express');
const router = express.Router();
const cloudinary = require('../cloudinary_setting'); // cloudinary 설정 불러오기
const supabase = require('../supabase_setting'); // supabase 설정 불러오기

/*
1. Cloudinary Signature 생성 API
- 프론트에서 요청 시 유효한 Signature와 Timestamp를 반환
- 프론트는 이를 사용해 Cloudinary에 직접 업로드
 */

router.post('/signature', async (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder  = `user|${유저아이디}`; // 폴더를 유저 아이디로 동적으로 만들기

    // cloudinary SDK에서 제공하는 서명 객체 생성 함수 사용
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
      },
      cloudinary.config().api_secret
    );

    res.status(200).json({
      success: true,
      signature,
      timestamp,
      cloudName: cloudinary.config().cloud_name,
      apiKey: cloudinary.config().api_key,
      folder: ''
    });
  } catch (err) {
    console.error('Signature 생성 오류:', err.message);
    res.status(500).json({
      success: false,
      message: 'Signature 생성 실패'
    });
  }
});

/*
2. POST 정보 저장 API
- 프론트에서 Cloudinary 업로드 완료 후 호출
- 이미지 URL과 게시글 정보를 Supabase에 저장
 */
router.post('/', async (req, res) => {
  try {
    const { placeName, placeAddress, content, userId, imageUrls, latitude, longitude } = req.body;

    // 2-1. 필수 입력값 검증
    if (!userId || !content) {
      return res.status(400).json({
        success: false,
        message: '필수 입력값이 누락되었습니다'
      });
    }

    // 이미지 URL이 배열인지, 최소 1개 이상인지 확인
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: '최소 1개 이상의 이미지 URL이 필요합니다'
      });
    }

    // 2-2. Supabase에 포스트 저장
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert([
        {
          user_id: userId,
          place_name: placeName || null,
          place_address: placeAddress || null,
          content: content.trim(),
          latitude: latitude || null,
          longitude: longitude || null,
          image_urls: imageUrls, // 배열로 저장
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (postError) throw postError;

    // 성공 응답
    res.status(201).json({
      success: true,
      message: '글이 저장되었습니다.',
      post: postData[0]
    });

  } catch (err) {
    console.error('포스트 저장 오류:', err.message);
    res.status(500).json({
      success: false,
      message: '글 저장 중 서버 오류가 발생했습니다.'
    });
  }
});

module.exports = router;