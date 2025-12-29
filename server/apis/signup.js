/*
1. 프론트엔드에서 보낸 POST 요청이 render 서버의 /signup 엔드포인트에 도착
2. 백엔드의 app.js에서 /signup 경로 처리
3. signup.js에서 JSON 데이터를 req.body로 받음
4. signup.js 파일의 router.post() 핸들러 실행
5. 핸들러에서 로직 처리 후 응답 전송
*/

const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcryptjs'); // 비밀번호 해싱 라이브러리
const supabase = require('../supabase_setting.js'); // supabase 설정 불러오기

// 회원가입 경로 접속 시 해야할 것들 (회원가입 로직)
// 1. 유효성 검증
// 2. 실제 회원가입 로직
router.post('/', async (req, res) => {
  const { name, gender, id, password, password_check } = req.body; 
  
  try {
    // 1. 필수 입력값 검증
    // 400 Bad Request(잘못된 요청) : 
    // 클라이언트가 보낸 요청의 파라미터가 서버의 유효성 검사(Validation)를 통과하지 못한 경우에 사용하는 표준 코드
    if(!id || !gender || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: '필수 항목을 입력해주세요.' 
      });
    }

    // 1.1 아이디와 비밀번호는 4자 이상이어야 함. (Supabase)제약 조건
    if(id.length < 4 || password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "아이디와 비밀번호는 4자 미만이거나, 50자를 초과할 수 없습니다."
      });
    }

    // 2. 비밀번호 검증
    // 400 Bad Request(잘못된 요청) : 
    // 클라이언트가 보낸 요청의 파라미터가 서버의 유효성 검사(Validation)를 통과하지 못한 경우에 사용하는 표준 코드
    if(password !== password_check) {
        return res.status(400).json({
            success: false,
            message: '비밀번호가 일치하지 않습니다.',
        });
    }

    // 3. 데이터베이스 아이디 중복 확인
    // Supabase는 select()의 결과로 data와 error를 반환
    const { data: existingUser } = await supabase
      .from('users')
      .select('login_id')
      .eq('login_id', id);

    // existingUser가 존재하면 중복된 아이디
    // 409 Conflict(충돌) : 사용자의 요청이 서버의 상태와 충돌
    if (existingUser && existingUser.length > 0) {
  return res.status(409).json({
    success: false,
    message: '이미 가입된 사용자입니다.'
  });
}



    // 1, 2, 3 검증이 모두 끝난 경우 회원가입 로직 실행
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10); // salt 라운드: 10

    // 사용자 데이터 삽입
    // insert() 메서드는 배열 형태로 인자 입력.
    const { error: insertError } = await supabase
      .from('users')
      .insert([
        { 
          login_id: id, 
          password: hashedPassword, 
          user_name: name, 
          gender: gender, 
          nickname: name // 처음에는 닉네임 대신 이름 삽입
        }
      ]);

    if (insertError) throw insertError;

    // 회원가입 완료
    // 201 Created(생성됨) : 요청이 성공적으로 처리되어서 리소스가 만들어졌음을 의미
    res.status(201).json({ 
      success: true, 
      message: '회원가입이 완료되었습니다.' 
    });

  } catch (err) {
    console.error('회원가입 오류:', err.message);
    // 500 Internal Server Error(내부 서버 오류): 서버에 오류가 발생해 작업을 수행할 수 없을 때 사용
    res.status(500).json({ 
      success: false, 
      message: '회원가입 과정에서 서버 오류가 발생했습니다.' 
    });
  } 
});

module.exports = router;
