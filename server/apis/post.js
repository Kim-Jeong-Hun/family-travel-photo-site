const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const cloudinary = require('../cloudinary_setting'); // cloudinary 설정 불러오기
const supabase = require('../supabase_setting'); // supabase 설정 불러오기

/*
1. Cloudinary Signature 생성 API
- 프론트에서 토큰과 함께 요청 시 유효한 Signature와 Timestamp를 반환
- 프론트는 이를 사용해 Cloudinary에 직접 업로드
 */

router.post('/signature', async (req, res) => {
  try {
    // Authorization 헤더 확인
    const authHeader = req.headers.authorization;
    if(!authHeader) {
      return res.status(401).json({ message: '인증이 필요합니다.'});
    }

    //Bearer와 token 구조 분해 할당
    const [scheme, token] = req.headers.authorization.split(' ');
    if(scheme !== 'Bearer') return res.status(401);

    // JWT 검증
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    const user_id = payload.uid;
    const login_id = payload.login_id;

    // 폴더 이름을 user_id와 login_id를 이용해 동적으로 만들기
    const timestamp = Math.floor(Date.now() / 1000);
    const folder  = `photos/${user_id}|${login_id}`;

    // cloudinary SDK에서 제공하는 서명 객체 생성 함수 사용
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      cloudinary.config().api_secret
    );
    
    // 프론트 응답
    res.status(200).json({
      success: true,
      signature,
      folder,
      timestamp
    });
  } catch (err) {
    console.error('Signature 생성 오류:', err.message);
    return res.status(401).json({
      success: false,
      message: '유효하지 않거나 만료된 토큰입니다.'
    });
  }
});

/*
2. POST 정보 저장 API
- 프론트에서 Cloudinary 업로드 완료 후 호출
- 게시글 정보(post_id, user_id, place_name, context, created_at, latitude, longitude)를 Supabase의 posts에 저장
- 이미지 경로(imageUrls)와 정보(image_id, post_id, image_order)를 Supabase의 post_images에 저장
 */
router.post('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({
      message: '인증이 필요합니다.'
    });

    //authHeader가 'Bearer token'이므로 토큰만 분리
    const token = authHeader.split(' ')[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = payload.uid;

    const { placeName, placeAddress, content, imageUrls, latitude, longitude } = req.body;

    // 2-1. 필수 입력값 검증
    if (!user_id || !content) {
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

    // 2-2. Supabase의 posts(post_id, user_id, content, created_at, latitude, longitude, place_name)
    // 에 포스트 저장
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert([
        {
          user_id: user_id,
          place_name: placeName === '위치 정보' ? null : placeName,
          place_address: placeAddress || null,
          content: content.trim(),
          latitude: latitude || null,
          longitude: longitude || null,
          created_at: new Date().toISOString()
        }
      ])
      .select();
      
      if (postError) throw postError;

    // 2-3. Supabase의 post_images(image_id, post_id, image_url, image_order)에 이미지 경로와 정보 저장
    const post_id = postData[0].post_id; // posts테이블에서 post_id 컬럼의 숫자 가져오기

    // 이미지 배열을 DB 형식에 맞게 변환
    // supabase의 .insert() 메소드는 인자를 배열 형식으로 받음
    const imageInserts = imageUrls.map((url, index) => ({
      post_id: post_id,
      image_url: url,
      image_order: index // 한 게시물 내에서의 이미지 순서
    }));

    const { error: imageError } = await supabase
      .from('post_images')
      .insert(imageInserts);

    if(imageError) throw imageError;

    // 성공 응답
    res.status(201).json({
      success: true,
      message: '게시글이 저장되었습니다.',
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