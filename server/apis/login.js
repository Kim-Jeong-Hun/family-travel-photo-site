/*
1. 프론트엔드에서 보낸 POST 요청이 render 서버의 /login 엔드포인트에 도착
2. 백엔드의 app.js에서 /login 경로 처리
3. login.js에서 JSON 데이터를 req.body로 받음
4. login.js 파일의 router.poset() 핸들러 실행
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
const router = express.Router();
const bcrypt = require('bcryptjs'); // 비밀번호 해싱 라이브러리
const supabase = require('../supabase_setting.js'); // supabase 설정 불러오기

router.post('/', async (req, res) => {
    const {id, password} = req.body;

    try {
        // 아이디, 비밀번호 검증
        if (!id || !password) {
        return res.status(400).json({ 
                success: false, 
                message: '필수 항목을 입력해주세요.'
            });
        }

        // 풀에서 데이터베이스 연결 가져오기
        connection = await pool.oracledb.getConnection();

        // SQL문 실행하여 가져온 ID를 result에 저장
        const result = await connection.execute(
            `SELECT PASSWORD FROM USERS WHERE USER_ID = :id`, {id: id},
            { outFormat: pool.oracledb.OUT_FORMAT_OBJECT });
            
        // ID 길이가 0인 경우
        if (result.rows.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: "아이디가 존재하지 않습니다."
            });
        }

        // 입력한 비밀번호와 저장된 비밀번호 비교
        const match = await bcrypt.compare(password, result.rows[0].PASSWORD);

        // 비밀번호 일치 시
        if(match) {
            res.json({
                success: true,
                message: "로그인에 성공하셨습니다."
            });
        } else {
            res.status(401).json({
                success: false,
                message: "비밀번호가 일치하지 않습니다."
            });
        }   
    } catch (err) {
        console.error('로그인 오류:', err);
        res.status(500).json({ 
            success: false,
            message: "로그인에 실패하셨습니다." 
        });
    } finally {
        if(connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

module.exports = router;