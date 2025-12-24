const express = require('express');
const router = express.Router();
const { getConnection, oracledb } = require('../oracledb_setting'); // 세팅 파일에서 커넥션 풀과 oracledb 가져오기
const { upload } = require('../cloudinary_setting'); // Cloudinary 이미지 업로드 미들웨어

/**
 * POST /write
 * 여행 사진과 정보를 저장하는 API
 * - 사진 여러 장을 Cloudinary에 업로드하고 URL 저장
 * - POSTS 테이블에 글 정보 저장
 * - POST_IMAGES 테이블에 이미지 URL들 저장
 */
router.post('/', upload.array('images', 10), async (req, res) => {
  let connection;
  try {
    // 클라이언트에서 전송받은 데이터
    const { latitude, longitude, content, userId } = req.body;

    // 1. 필수 입력값 검증
    // 사용자 ID, 글 내용, 좌표가 모두 있는지 확인
    if (!userId || !content || !latitude || !longitude) {
      return res.status(400).json({ error: '필수 입력값이 누락되었습니다' });
    }

    // 최소 1개 이상의 이미지가 있는지 확인
    // 여행 사진 글은 이미지가 필수이므로 이미지 없으면 거절
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '최소 1개 이상의 이미지가 필요합니다' });
    }

    // 2. 좌표(위도, 경도) 유효성 검사
    // 문자열로 받은 좌표를 숫자로 변환
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    // 유효한 좌표인지 확인
    // - 위도(lat): -90 ~ 90 범위
    // - 경도(lng): -180 ~ 180 범위
    // - NaN(숫자가 아닌 경우)도 거절
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ error: '유효하지 않은 좌표입니다' });
    }

    // 3. 데이터베이스 준비
    // Cloudinary에 업로드된 이미지들의 경로(URL) 배열로 변환
    const imageUrls = req.files.map(file => file.path);
    
    // 데이터베이스 커넥션 풀에서 연결 하나를 가져오기
    // 풀을 사용하면 매번 새로운 연결을 생성하지 않아 성능이 좋음
    connection = await getConnection();

    // 4. POSTS 테이블에 글 정보 저장
    // RETURNING 절을 사용해서 INSERT 후 자동 생성된 POST_ID를 받아옴
    const postSql = `
      INSERT INTO POSTS (USER_ID, CONTENT, LATITUDE, LONGITUDE)
      VALUES (:user_id, :content, :lat, :lng)
      RETURNING POST_ID INTO :post_id
    `;

    const postResult = await connection.execute(postSql, {
      user_id: userId,
      content: content.trim(), // 앞뒤 공백 제거
      lat: lat,
      lng: lng,
      post_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } // 생성된 POST_ID를 받기 위한 설정
    });

    // 방금 생성된 POST_ID를 변수에 저장 (다음 단계에서 이미지 저장할 때 필요)
    const newPostId = postResult.outBinds.post_id[0];

    // 5. POST_IMAGES 테이블에 모든 이미지 URL 저장
    // 각 이미지마다 별도의 행으로 저장하기 위해 SQL 준비
    const imageSql = `
      INSERT INTO POST_IMAGES (POST_ID, IMAGE_URL, IMAGE_ORDER)
      VALUES (:post_id, :img_url, :img_order)
    `;

    // Promise.all을 사용해서 모든 이미지를 병렬로 저장
    // (각 이미지를 순서대로 저장, IMAGE_ORDER는 1부터 시작)
    const imagePromises = imageUrls.map((url, index) => {
      return connection.execute(imageSql, {
        post_id: newPostId,
        img_url: url,
        img_order: index + 1 // 첫 번째 이미지는 1, 두 번째는 2, ...
      });
    });

    // 모든 이미지 저장 작업이 완료될 때까지 대기
    await Promise.all(imagePromises);
    
    // 6. 트랜잭션 커밋
    // 글과 이미지 저장이 모두 성공했으므로 변경사항을 데이터베이스에 반영
    await connection.commit();

    // 성공 응답: 저장된 글의 ID를 반환
    res.status(201).json({ success: true, postId: newPostId });

  } catch (err) {
    // 에러 발생 시 커밋된 변경사항을 모두 되돌림 (롤백)
    // 글은 저장됐는데 이미지는 못 저장된 경우처럼 불완전한 상태를 방지
    if (connection) await connection.rollback();
    console.error('Post write error:', err);
    
    // 에러 타입별로 다른 응답 제공
    if (err.errorNum === 1) {
      // 고유 제약 조건 위반 (예: 중복된 데이터)
      res.status(409).json({ error: '고유 제약 조건 위반' });
    } else if (err.errorNum === 2291) {
      // 외래키 제약 위반 (예: 존재하지 않는 사용자 ID)
      res.status(400).json({ error: '존재하지 않는 사용자입니다' });
    } else {
      // 그 외 예상하지 못한 에러
      res.status(500).json({ error: 'DB 저장 실패' });
    }
  } finally {
    // 정리 작업
    // 커넥션을 풀에 반환 (다음 요청에서 재사용할 수 있도록)
    if (connection) await connection.close();
  }
});

module.exports = router;