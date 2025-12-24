/*
1. 프론트엔드에서 보낸 POST 요청이 render 서버의 /signup 엔드포인트에 도착
2. 백엔드의 app.js에서 /signup 경로 처리
3. signup.js에서 JSON 데이터를 req.body로 받음
4. signup.js 파일의 router.poset() 핸들러 실행
5. 핸들러에서 로직 처리 후 응답 전송
*/

const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcryptjs'); // 비밀번호 해싱 라이브러리
const pool = require('../oracledb_setting.js'); // 데이터베이스 커넥션 풀

// 회원가입 경로 접속 시 해야할 것들 (회원가입 로직)
// 1. 유효성 검증
// 2. 실제 회원가입 로직
router.post('/', async (req, res) => {
  const { name, gender, id, password, password_check } = req.body;
  let connection;
  
  try {
    // 필수 입력값 검증
    // 400 Bad Request(잘못된 요청) : 
    // 클라이언트가 보낸 요청의 파라미터가 서버의 유효성 검사(Validation)를 통과하지 못한 경우에 사용하는 표준 코드
    if (!id || !gender || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: '필수 항목을 입력해주세요.' 
      });
    }

    // 풀에서 데이터베이스 연결 가져오기
    connection = await pool.oracledb.getConnection();

    // 데이터베이스 아이디 중복 확인
    const checkId = await connection.execute(
      `SELECT COUNT(*) as cnt FROM USERS WHERE USER_ID = :id`,
      { id: id },
      { outFormat: pool.oracledb.OUT_FORMAT_OBJECT }
    );

    // 409 Conflict(충돌) : 사용자의 요청이 서버의 상태와 충돌하여 응답하는 코드
    if (checkId.rows[0].CNT > 0) {
        return res.status(409).json({ 
            success: false, 
            message: '이미 가입된 아이디입니다.' 
        });
    }

    // 비밀번호 검증
    // 400 Bad Request(잘못된 요청) : 
    // 클라이언트가 보낸 요청의 파라미터가 서버의 유효성 검사(Validation)를 통과하지 못한 경우에 사용하는 표준 코드
    if(password !== password_check) {
        return res.status(400).json({
            success: false,
            message: '비밀번호가 일치하지 않습니다.',

        });
    };

    // 위의 검증이 모두 끝난 경우 회원가입 실시
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10); // salt 라운드: 10

    // 사용자 데이터 데이터베이스 삽입 SQL문 실행
    const result = await connection.execute(
      `INSERT INTO USERS (USER_ID, PASSWORD, USER_NAME, GENDER, NICKNAME) 
       VALUES (:id, :password, :name, :gender, :name)`,
      {
        id: id,
        password: hashedPassword, // 해싱된 비밀번호 저장
        name: name,
        gender: gender
      },
      { autoCommit: true }
    );

    res.status(201).json({ 
      success: true, 
      message: '회원가입이 완료되었습니다.' 
    });

  } catch (err) {
    console.error('회원가입 오류:', err);
    res.status(500).json({ 
      success: false, 
      message: '회원가입에 실패했습니다.' 
    });
  } finally {
    if (connection) {
      try {
        await connection.close(); // 데이터베이스 연결 풀에 반납
      } catch (err) {
        console.error('연결 종료 오류:', err);
      }
    }
  }
});

module.exports = router;
