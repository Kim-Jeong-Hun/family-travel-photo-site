const express = require('express'); 
const bcrypt = require('bcrypt'); // 비밀번호 해싱 라이브러리
const pool = require('./pool.js'); // 데이터베이스 커넥션 풀
const router = express.Router();

// 회원가입 라우트
router.post('/register', async (req, res) => {
  let connection;
  try {
    const { name, gender, id, password, password_check } = req.body;

    // 필수 입력값 검증
    // 400 Bad Request(잘못된 요청) : 
    // 클라이언트가 보낸 요청의 파라미터가 서버의 유효성 검사(Validation)를 통과하지 못한 경우에 사용하는 표준 코드
    if (!id || !gender || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: '필수 항목을 입력해주세요.' 
      });
    }

    // 데이터베이스 연결 가져오기
    connection = await pool.oracledb.getConnection();

    // 데이터베이스 아이디 중복 확인
    const checkEmail = await connection.execute(
      `SELECT COUNT(*) as cnt FROM USERS WHERE USER_ID = :id`,
      { id: id },
      { outFormat: pool.oracledb.OUT_FORMAT_OBJECT }
    );

    // 409 Conflict(충돌) : 사용자의 요청이 서버의 상태와 충돌하여 응답하는 코드
    if (checkEmail.rows[0].CNT > 0) {
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

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10); // salt 라운드: 10

    // 사용자 데이터 데이터베이스 삽입
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
      message: '서버 오류가 발생했습니다.' 
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결 종료 오류:', err);
      }
    }
  }
});

module.exports = router;
