/*
1. 프론트엔드에서 보낸 POST 요청이 render 서버의 /login 엔드포인트에 도착
2. 백엔드의 app.js에서 /login 경로 처리
3. login.js에서 JSON 데이터를 req.body로 받음
4. login.js 파일의 router.post() 핸들러 실행
    - 아이디 조회 (없으면 존재하지 않는 아이디, 있으면 bcrypt로 입력된 비밀번호와 DB의 해싱된 비밀번호 비교)
    - 비밀번호 일치 시 JWT 발급
    - 프론트엔드에 JWT 토큰 반환
    - 토큰을 로컬 스토리지/쿠키에 저장
    (- 이후 게시물 작성 요청 시 JWT 토큰 요청
    - 토큰 검증
    - 게시물 저장, 처리) 
5. 핸들러에서 로직 처리 후 응답 전송
*/

const express = require('express');
const bcrypt = require('bcryptjs'); // 비밀번호 해싱 라이브러리
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../supabase_setting.js'); // supabase 설정 불러오기

router.post('/', async (req, res) => {
    const {id, password} = req.body;

    try {
        // 1. 필수 입력값 검증
        if (!id || !password) {
            return res.status(400).json({ 
                success: false, 
                message: '필수 항목을 입력해주세요.'
            });
        }

        // 2. 데이터베이스에 해당 아이디를 가진 유저 조회 (user_id : 토큰을 위해 조회)
        const { data: userData, error: checkError } = await supabase
            .from('users')
            .select('user_id, login_id, password')
            .eq('login_id', id)
            .single(); // 단건 조회 (객체 반환)
        
        // 3. 아이디 존재 여부 확인 
        // 401 Unauthorized(권한 없음) : 로그인 등 인증이 필요한 리소스에 인증 없이 접근할 경우 발생
        // 아이디가 틀린 경우 - 보안을 위해 메시지는 '아이디 또는 비밀번호'로 출력
        if(checkError || !userData) {
            return res.status(401).json({
                success: false,
                message: '아이디 또는 비밀번호가 일치하지 않습니다.'
            })
        }

        // 4. 아이디가 일치한다면 비밀번호 해시값 비교
        const passwordIsMatch = await bcrypt.compare(password, userData.password);

        // 5. 로그인 성공 및 jwt 토큰 발급
        if(passwordIsMatch) {
            const accessToken = jwt.sign(
                { uid: userData.user_id, login_id: userData.login_id},
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return res.status(200).json({
                success: true,
                message: '성공적으로 로그인되었습니다.',
                token: accessToken // 프론트엔드로 토큰 전달
            });
            // jwt 토큰 발급 로직
        } else { // 비밀번호가 틀린 경우 - 보안을 위해 메시지는 '아이디 또는 비밀번호'로 출력
            return res.status(401).json({
                success: false,
                message: '아이디 또는 비밀번호가 일치하지 않습니다.'
            });
        }
   
    } catch (err) {
        console.error('로그인 오류:', err);
        // 500 Internal Server Error(내부 서버 오류): 서버에 오류가 발생해 작업을 수행할 수 없을 때 사용
        res.status(500).json({ 
            success: false,
            message: "로그인 과정에서 서버 오류가 발생했습니다." 
        });
    }
});

module.exports = router;